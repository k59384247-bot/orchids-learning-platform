"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Upload, 
  FileText, 
  X, 
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { toast } from "sonner"

const domains = [
  { id: "math", label: "Mathematics" },
  { id: "engineering", label: "Engineering" },
  { id: "physics", label: "Physics" },
  { id: "history", label: "History" },
  { id: "literature", label: "Literature" },
  { id: "cs", label: "Computer Science" },
  { id: "medicine", label: "Medicine" },
  { id: "law", label: "Law" },
  { id: "other", label: "Other" },
]

type UploadState = "idle" | "selected" | "processing" | "error" | "complete"

  export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null)
    const [courseName, setCourseName] = useState("")
    const [domain, setDomain] = useState("")
    const [semester, setSemester] = useState("")
    const [professor, setProfessor] = useState("")
    const [uploadState, setUploadState] = useState<UploadState>("idle")
    const [progress, setProgress] = useState(0)
    const [statusText, setStatusText] = useState("")
    const [isDragging, setIsDragging] = useState(false)
    const { user, isMock, loading: authLoading } = useAuth()
    const router = useRouter()


  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      const allowedTypes = [
        "application/pdf", 
        "text/plain", 
        "text/markdown", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]
      const allowedExtensions = [".pdf", ".txt", ".doc", ".docx", ".md"]
      const fileExtension = droppedFile.name.toLowerCase().substring(droppedFile.name.lastIndexOf("."))

      if (allowedTypes.includes(droppedFile.type) || allowedExtensions.includes(fileExtension)) {
        setFile(droppedFile)
        setCourseName(droppedFile.name.replace(/\.[^/.]+$/, ""))
        setUploadState("selected")
      } else {
        toast.error("Please upload a supported text file (PDF, TXT, DOCX, MD)")
      }
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const allowedTypes = [
        "application/pdf", 
        "text/plain", 
        "text/markdown", 
        "application/msword", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ]
      const allowedExtensions = [".pdf", ".txt", ".doc", ".docx", ".md"]
      const fileExtension = selectedFile.name.toLowerCase().substring(selectedFile.name.lastIndexOf("."))

      if (allowedTypes.includes(selectedFile.type) || allowedExtensions.includes(fileExtension)) {
        setFile(selectedFile)
        setCourseName(selectedFile.name.replace(/\.[^/.]+$/, ""))
        setUploadState("selected")
      } else {
        toast.error("Please upload a supported text file (PDF, TXT, DOCX, MD)")
      }
    }
  }

    const handleStartProcessing = async () => {
      console.log("Start processing clicked", { file, user, isMock })
      
      if (!file) {
        toast.error("Please select a file first")
        return
      }

      setUploadState("processing")
      setProgress(0)
      setStatusText("Uploading file...")

      try {
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 90) {
              clearInterval(interval)
              return 90
            }
            return prev + 10
          })
        }, 500)

        setTimeout(() => setStatusText("Extracting text..."), 1500)
        setTimeout(() => setStatusText("Creating chunks..."), 3000)
        setTimeout(() => setStatusText("Almost ready..."), 4500)

        // Always proceed to mock course for testing
        setTimeout(() => {
          clearInterval(interval)
          setProgress(100)
          setStatusText("Complete!")
          setUploadState("complete")
          setTimeout(() => router.push("/course/mock-course-1"), 1500)
        }, 5000)

      } catch (error) {
        console.error("Upload error:", error)
        setUploadState("error")
        setStatusText("Something went wrong")
        toast.error("Could not process file. Please try again.")
      }
    }

  const handleReset = () => {
    setFile(null)
    setCourseName("")
    setDomain("")
    setSemester("")
    setProfessor("")
    setUploadState("idle")
    setProgress(0)
    setStatusText("")
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
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
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-muted-foreground mb-8">
            Upload a file to transform it into simplified learning materials
          </p>

          <AnimatePresence mode="wait">
            {uploadState === "idle" && (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`border-2 border-dashed rounded-xl p-16 text-center transition-all duration-200 cursor-pointer ${
                  isDragging 
                    ? "border-sage bg-sage/10" 
                    : "border-border hover:border-sage/50"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.md"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? "text-sage" : "text-muted-foreground"}`} />
                <p className="text-lg font-medium mb-2">
                  Drag file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, TXT, DOCX, and Markdown up to 100MB
                </p>
              </motion.div>
            )}

            {uploadState === "selected" && (
              <motion.div
                key="selected"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="bg-elevated rounded-xl border border-border p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-sage" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{file?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {file && formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleReset}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="bg-elevated rounded-xl border border-border p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="courseName">Course Name</Label>
                    <Input
                      id="courseName"
                      value={courseName}
                      onChange={(e) => setCourseName(e.target.value)}
                      placeholder="Introduction to Thermodynamics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="domain">Domain</Label>
                    <Select value={domain} onValueChange={setDomain}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a domain" />
                      </SelectTrigger>
                      <SelectContent>
                        {domains.map(d => (
                          <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="semester">Semester (optional)</Label>
                      <Input
                        id="semester"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="Fall 2024"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="professor">Professor (optional)</Label>
                      <Input
                        id="professor"
                        value={professor}
                        onChange={(e) => setProfessor(e.target.value)}
                        placeholder="Dr. Smith"
                      />
                    </div>
                  </div>
                </div>

                  <div className="flex gap-4">
                    <Button variant="outline" onClick={handleReset} className="flex-1">
                      Cancel
                    </Button>
                      <Button 
                        onClick={handleStartProcessing}
                        disabled={!courseName.trim() || authLoading}
                        className="flex-1 bg-sage hover:bg-sage/90 text-sage-foreground"
                      >
                        {authLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Start Processing"
                        )}
                      </Button>
                  </div>

              </motion.div>
            )}

            {uploadState === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-elevated rounded-xl border border-border p-12 text-center"
              >
                <Loader2 className="w-12 h-12 text-sage mx-auto mb-6 animate-spin" />
                <div className="w-full max-w-md mx-auto mb-4">
                  <div className="h-2 bg-surface rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-sage"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
                <p className="text-lg font-medium mb-1">{progress}%</p>
                <p className="text-muted-foreground">{statusText}</p>
                <Button variant="outline" onClick={handleReset} className="mt-6">
                  Cancel
                </Button>
              </motion.div>
            )}

            {uploadState === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-elevated rounded-xl border border-border p-12 text-center"
              >
                <div className="w-16 h-16 bg-sage/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-sage" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Processing Complete!</h2>
                <p className="text-muted-foreground mb-6">
                  Redirecting to your course...
                </p>
                <Loader2 className="w-6 h-6 text-sage mx-auto animate-spin" />
              </motion.div>
            )}

            {uploadState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="bg-elevated rounded-xl border border-border p-12 text-center"
              >
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t process your file. Please try again.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={handleReset}>
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="bg-sage hover:bg-sage/90 text-sage-foreground"
                  >
                    Choose Different File
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
