"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft,
  Sun,
  Moon,
  Trash2,
  Download,
  RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useTheme } from "next-themes"
import { toast } from "sonner"

export default function SettingsPage() {
  const { user, profile, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [explanationStyle, setExplanationStyle] = useState<"simple" | "technical">("simple")
  const [autoShowVisuals, setAutoShowVisuals] = useState(false)
  const [textSize, setTextSize] = useState([18])
  const [storageUsed, setStorageUsed] = useState(0)

  const calculateStorage = useCallback(async () => {
    if (!user) return
    const { count } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
    setStorageUsed((count || 0) * 2.5)
  }, [user])

  useEffect(() => {
    setMounted(true)
    if (profile?.preferences) {
      setExplanationStyle(profile.preferences.explanation_style || "simple")
    }
    calculateStorage()
  }, [profile, calculateStorage])

  const handleDeleteAccount = async () => {
    if (!user) return
    
    await supabase.from("courses").delete().eq("user_id", user.id)
    await supabase.from("users").delete().eq("id", user.id)
    await signOut()
    router.push("/")
    toast.success("Account deleted successfully")
  }

  const handleExportData = () => {
    toast.info("Export feature coming soon")
  }

  const handleClearCache = () => {
    localStorage.clear()
    toast.success("Cache cleared")
  }

  const savePreferences = async () => {
    if (!user) return
    
    await supabase.from("users").update({
      preferences: {
        ...profile?.preferences,
        explanation_style: explanationStyle
      }
    }).eq("id", user.id)
    
    toast.success("Preferences saved")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <div className="space-y-8">
              <div className="bg-elevated rounded-xl border border-border/40 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme">Theme</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                        className={`gap-2 ${theme === "light" ? "bg-sage hover:bg-sage/90 text-sage-foreground" : ""}`}
                      >
                        <Sun className="w-4 h-4" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                        className={`gap-2 ${theme === "dark" ? "bg-sage hover:bg-sage/90 text-sage-foreground" : ""}`}
                      >
                        <Moon className="w-4 h-4" />
                        Dark
                      </Button>
                    </div>
                  </div>
  
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                        theme === "light" ? "border-sage bg-[#FFFFFF]" : "border-transparent bg-surface"
                      }`} onClick={() => setTheme("light")}>
                        <div className="h-16 rounded bg-[#F7F1EA] mb-2" />
                        <p className="text-xs text-muted-foreground">Light Mode</p>
                      </div>
                    <div className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                      theme === "dark" ? "border-sage bg-[#1B2320]" : "border-transparent bg-surface"
                    }`} onClick={() => setTheme("dark")}>
                      <div className="h-16 rounded bg-[#0F1411] mb-2" />
                      <p className="text-xs text-muted-foreground">Dark Mode</p>
                    </div>
                  </div>
                </div>
              </div>
  
              <div className="bg-elevated rounded-xl border border-border/40 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Learning Preferences</h2>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Default explanation depth</Label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="explanationStyle"
                          checked={explanationStyle === "simple"}
                          onChange={() => setExplanationStyle("simple")}
                          className="w-4 h-4 text-sage border-border focus:ring-sage"
                        />
                        <span className="text-sm">Simplified</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="explanationStyle"
                          checked={explanationStyle === "technical"}
                          onChange={() => setExplanationStyle("technical")}
                          className="w-4 h-4 text-sage border-border focus:ring-sage"
                        />
                        <span className="text-sm">Technical</span>
                      </label>
                    </div>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoVisuals">Auto-show visuals</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Automatically display diagrams when available
                      </p>
                    </div>
                    <Switch
                      id="autoVisuals"
                      checked={autoShowVisuals}
                      onCheckedChange={setAutoShowVisuals}
                    />
                  </div>
  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Text size</Label>
                      <span className="text-sm text-muted-foreground">{textSize[0]}px</span>
                    </div>
                    <Slider
                      value={textSize}
                      onValueChange={setTextSize}
                      min={14}
                      max={22}
                      step={1}
                      className="w-full"
                    />
                  </div>
  
                  <Button onClick={savePreferences} className="bg-sage hover:bg-sage/90 text-sage-foreground">
                    Save Preferences
                  </Button>
                </div>
              </div>
  
              <div className="bg-elevated rounded-xl border border-border/40 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Account</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
  
                  <Separator />
  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Change password</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Update your account password
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change
                    </Button>
                  </div>
  
                  <Separator />
  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-destructive">Delete account</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive border-destructive/50 hover:bg-destructive/10">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove all your courses and data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
  
              <div className="bg-elevated rounded-xl border border-border/40 p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Data</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Storage used</Label>
                      <span className="text-sm text-muted-foreground">{storageUsed.toFixed(1)} MB / 100 MB</span>
                    </div>
                    <div className="h-2 bg-surface rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-sage transition-all duration-300"
                        style={{ width: `${(storageUsed / 100) * 100}%` }}
                      />
                    </div>
                  </div>
  
                  <Separator />
  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Export courses</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Download all your course data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleExportData}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Clear cache</Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        Clear local stored data
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleClearCache}>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </div>
        </motion.div>
      </div>
    </div>
  )
}
