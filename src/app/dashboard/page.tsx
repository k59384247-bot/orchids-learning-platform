"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Plus, 
  Upload, 
  Settings, 
  LogOut, 
  MoreVertical, 
  Clock,
  BookOpen,
  ChevronRight,
  PanelLeftClose,
  PanelLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { supabase, Course } from "@/lib/supabase"
import { toast } from "sonner"

const domainColors: Record<string, string> = {
  math: "bg-blue-500/10 text-blue-600",
  engineering: "bg-orange-500/10 text-orange-600",
  physics: "bg-purple-500/10 text-purple-600",
  history: "bg-amber-500/10 text-amber-600",
  literature: "bg-pink-500/10 text-pink-600",
  cs: "bg-green-500/10 text-green-600",
  medicine: "bg-red-500/10 text-red-600",
  law: "bg-slate-500/10 text-slate-600",
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 32
  const strokeWidth = 4
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="relative w-20 h-20">
      <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
        <circle
          stroke="var(--border)"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="var(--sage)"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-medium">{progress}%</span>
      </div>
    </div>
  )
}

function CourseCard({ course, onDelete }: { course: Course; onDelete: (id: string) => void }) {
  const router = useRouter()
  
  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    return d.toLocaleDateString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
      transition={{ duration: 0.2 }}
      className="bg-elevated rounded-xl border border-border p-6 cursor-pointer group"
      onClick={() => router.push(`/course/${course.id}`)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {course.title}
          </h3>
          {course.domain && (
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${domainColors[course.domain] || "bg-muted text-muted-foreground"}`}>
              {course.domain.charAt(0).toUpperCase() + course.domain.slice(1)}
            </span>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation()
              toast.info("Rename feature coming soon")
            }}>
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation()
                onDelete(course.id)
              }}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {formatDate(course.updated_at)}
        </div>
        <ProgressRing progress={course.progress} />
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full mt-4 opacity-0 group-hover:opacity-100 transition-opacity gap-2"
      >
        Continue <ChevronRight className="w-4 h-4" />
      </Button>
    </motion.div>
  )
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-24"
    >
      <div className="w-24 h-24 bg-sage/10 rounded-full flex items-center justify-center mb-6">
        <Upload className="w-10 h-10 text-sage" />
      </div>
      <h2 className="text-2xl font-semibold mb-2">Upload your first course PDF</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Transform dense academic materials into simplified explanations with interactive visualizations
      </p>
      <Link href="/upload">
        <Button className="bg-sage hover:bg-sage/90 text-sage-foreground gap-2">
          <Plus className="w-4 h-4" />
          Get Started
        </Button>
      </Link>
    </motion.div>
  )
}

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, signOut, profile, isMock } = useAuth()
  const router = useRouter()

  const fetchCourses = useCallback(async () => {
    if (!user) return
    
    if (isMock || localStorage.getItem("mock_mode") === "true") {
      setCourses([
        {
          id: "mock-course-1",
          user_id: user.id,
          title: "Introduction to Thermodynamics",
          domain: "physics",
          progress: 65,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "mock-course-2",
          user_id: user.id,
          title: "Advanced Organic Chemistry",
          domain: "medicine",
          progress: 30,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "mock-course-3",
          user_id: user.id,
          title: "Modern History 101",
          domain: "history",
          progress: 90,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })

    if (!error && data) {
      setCourses(data)
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (user) {
      fetchCourses()
    }
  }, [user, fetchCourses])

  const handleDeleteCourse = async (courseId: string) => {
    const { error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId)

    if (error) {
      toast.error("Could not delete course")
    } else {
      setCourses(courses.filter(c => c.id !== courseId))
      toast.success("Course deleted")
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside 
        className={`bg-surface border-r border-border flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-60"
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="text-xl font-semibold text-foreground">
              Cognify
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="h-8 w-8"
          >
            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </Button>
        </div>
        
        <nav className="flex-1 p-2">
          <Link href="/dashboard">
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 mb-1 ${sidebarCollapsed ? "px-2" : ""}`}
            >
              <BookOpen className="w-5 h-5" />
              {!sidebarCollapsed && "Dashboard"}
            </Button>
          </Link>
          <Link href="/settings">
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-3 ${sidebarCollapsed ? "px-2" : ""}`}
            >
              <Settings className="w-5 h-5" />
              {!sidebarCollapsed && "Settings"}
            </Button>
          </Link>
        </nav>

        <div className="p-2 border-t border-border">
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-muted-foreground hover:text-foreground ${sidebarCollapsed ? "px-2" : ""}`}
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && "Sign Out"}
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Courses</h1>
              {profile?.full_name && (
                <p className="text-muted-foreground mt-1">Welcome back, {profile.full_name.split(" ")[0]}</p>
              )}
            </div>
            <Link href="/upload">
              <Button className="bg-sage hover:bg-sage/90 text-sage-foreground gap-2">
                <Plus className="w-4 h-4" />
                Create Course
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-elevated rounded-xl border border-border p-6 h-48 skeleton-shimmer" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map(course => (
                <CourseCard 
                  key={course.id} 
                  course={course} 
                  onDelete={handleDeleteCourse}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
