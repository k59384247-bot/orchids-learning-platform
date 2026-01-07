"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Maximize2,
  LineChart,
  MessageCircle,
  X,
  Send,
  RotateCcw,
  Play,
  Pause
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase, Chunk, Course } from "@/lib/supabase"

type SelectionToolbarPosition = {
  top: number
  left: number
}

function SelectionToolbar({
  position,
  onSimplify,
  onExpand,
  onShowDiagram,
  onAskAI
}: {
  position: SelectionToolbarPosition
  onSimplify: () => void
  onExpand: () => void
  onShowDiagram: () => void
  onAskAI: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.14 }}
      className="fixed z-50 bg-elevated border border-border rounded-lg shadow-lg p-1 flex gap-1"
      style={{ top: position.top - 48, left: position.left }}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage"
        onClick={onSimplify}
      >
        <Sparkles className="w-3.5 h-3.5" />
        Simplify
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage"
        onClick={onExpand}
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Expand
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage"
        onClick={onShowDiagram}
      >
        <LineChart className="w-3.5 h-3.5" />
        Diagram
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage"
        onClick={onAskAI}
      >
        <MessageCircle className="w-3.5 h-3.5" />
        Ask AI
      </Button>
    </motion.div>
  )
}

function InlineExpansion({ content, onDismiss }: { content: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className="my-4 bg-sage/5 border-l-2 border-sage rounded-lg p-5 relative"
    >
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface hover:bg-muted flex items-center justify-center transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <p className="reading-text text-foreground pr-8">{content}</p>
    </motion.div>
  )
}

function AnimatedDiagram({ isPlaying, onToggle, onReset }: { isPlaying: boolean; onToggle: () => void; onReset: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setStep(s => (s + 1) % 5)
    }, 1200)
    return () => clearInterval(interval)
  }, [isPlaying])

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <svg viewBox="0 0 400 250" className="w-full max-w-md">
          <defs>
            <linearGradient id="hot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
            <linearGradient id="cold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>

          <rect x="40" y="60" width="100" height="130" rx="8" fill="url(#hot)" opacity={step >= 0 ? 1 : 0.3} />
          <text x="90" y="130" textAnchor="middle" className="fill-white text-sm font-medium">HOT</text>
          <text x="90" y="150" textAnchor="middle" className="fill-white/80 text-xs">High Energy</text>

          <rect x="260" y="60" width="100" height="130" rx="8" fill="url(#cold)" opacity={step >= 0 ? 1 : 0.3} />
          <text x="310" y="130" textAnchor="middle" className="fill-white text-sm font-medium">COLD</text>
          <text x="310" y="150" textAnchor="middle" className="fill-white/80 text-xs">Low Energy</text>

          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <path d="M150 125 L250 125" stroke="var(--sage)" strokeWidth="3" strokeDasharray="8 4" />
              <polygon points="245,120 255,125 245,130" fill="var(--sage)" />
            </motion.g>
          )}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map((i) => (
                <motion.circle
                  key={i}
                  cx={170 + i * 30}
                  cy={125}
                  r="6"
                  fill="var(--sage)"
                  animate={{
                    x: [0, 20, 0],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.g>
          )}

          {step >= 3 && (
            <motion.text
              x="200"
              y="200"
              textAnchor="middle"
              className="fill-muted-foreground text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Energy flows from hot to cold
            </motion.text>
          )}

          {step >= 4 && (
            <motion.text
              x="200"
              y="225"
              textAnchor="middle"
              className="fill-sage text-sm font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Entropy increases
            </motion.text>
          )}
        </svg>
      </div>

      <div className="h-12 border-t border-border flex items-center justify-center gap-4 px-4">
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onToggle}>
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        <div className="flex-1 max-w-[200px]">
          <div className="h-1 bg-surface rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-sage"
              animate={{ width: `${(step + 1) * 20}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

function VisualPanel({
  isOpen,
  onClose,
  selectedText
}: {
  isOpen: boolean
  onClose: () => void
  selectedText: string
}) {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "40%", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="h-full bg-elevated border-l border-border flex flex-col overflow-hidden"
          style={{ minWidth: isOpen ? 400 : 0, maxWidth: 600 }}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">
                Visualizing: {selectedText.slice(0, 50)}...
              </p>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 bg-surface/50">
            <AnimatedDiagram
              isPlaying={isPlaying}
              onToggle={() => setIsPlaying(!isPlaying)}
              onReset={() => setIsPlaying(true)}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ChatDrawer({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hi! I'm here to help you understand the material. Ask me anything about what you're reading." }
  ])

  const suggestions = [
    "Simplify this section",
    "Show me a diagram",
    "Explain this more",
    "What's the main idea?"
  ]

  const handleSend = () => {
    if (!message.trim()) return
    setMessages([...messages, { role: "user", content: message }])
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Think of entropy like the natural tendency of your room to get messy. Without putting in energy to clean it, things just naturally become more disordered over time. That's essentially what the second law of thermodynamics describes - systems naturally move toward disorder."
      }])
    }, 1000)
    setMessage("")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-x-0 bottom-0 z-50 h-[50vh] bg-elevated border-t border-border rounded-t-xl shadow-2xl flex flex-col"
          style={{ backdropFilter: "blur(8px)" }}
        >
          <div className="h-14 border-b border-border flex items-center justify-between px-4">
            <div>
              <h3 className="font-medium">AI Assistant</h3>
              <p className="text-xs text-muted-foreground">Ask about your course material</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 1 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setMessage(suggestion)
                    }}
                    className="p-3 text-sm text-left rounded-lg border border-border hover:bg-surface transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-sage-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-sage/10 rounded-br-sm"
                      : "bg-surface border border-border rounded-bl-sm"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0" />
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask a question..."
                className="w-full h-12 max-h-24 px-4 py-3 pr-12 bg-surface border border-border rounded-2xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-sage/50"
                rows={1}
              />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-sage hover:bg-sage/90"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send className="w-4 h-4 text-sage-foreground" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CourseWorkspacePage() {
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [currentChunk, setCurrentChunk] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedText, setSelectedText] = useState("")
  const [toolbarPosition, setToolbarPosition] = useState<SelectionToolbarPosition | null>(null)
  const [expansion, setExpansion] = useState<{ index: number; content: string } | null>(null)
  const [visualPanelOpen, setVisualPanelOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const textCanvasRef = useRef<HTMLDivElement>(null)

  const fetchCourseData = useCallback(async () => {
    if (courseId.startsWith("mock-")) {
      setCourse({
        id: courseId,
        user_id: "mock-user-123",
        title: courseId === "mock-course-1" ? "Introduction to Thermodynamics" : "Advanced Organic Chemistry",
        domain: courseId === "mock-course-1" ? "physics" : "medicine",
        progress: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      
      setChunks([
        {
          id: "mock-chunk-1",
          document_id: "mock-doc-1",
          sequence: 1,
          content: "The second law of thermodynamics is a fundamental principle in physics that describes the natural tendency of systems to move toward a state of maximum entropy, or disorder. This law has profound implications for understanding energy transformations, the arrow of time, and the ultimate fate of the universe.\n\nAt its core, the second law states that in any spontaneous process, the total entropy of an isolated system always increases. Entropy can be thought of as a measure of the randomness or disorder in a system. A highly ordered system, like a neatly arranged deck of cards, has low entropy, while a shuffled deck has high entropy.",
          word_count: 150,
          created_at: new Date().toISOString()
        },
        {
          id: "mock-chunk-2",
          document_id: "mock-doc-1",
          sequence: 2,
          content: "This principle explains why heat naturally flows from hot objects to cold ones, never the reverse. When you place an ice cube in a warm room, it melts because the molecules in the surrounding air have more kinetic energy and transfer that energy to the slower-moving molecules in the ice. The reverse process—an ice cube spontaneously forming in a warm room—would decrease entropy and violate the second law.\n\nThe mathematical formulation of entropy was developed by Ludwig Boltzmann, who showed that entropy (S) is related to the number of possible microscopic states (W) of a system through the famous equation: S = k ln W, where k is Boltzmann's constant.",
          word_count: 160,
          created_at: new Date().toISOString()
        }
      ])
      setLoading(false)
      return
    }

    const { data: courseData } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single()

    if (courseData) {
      setCourse(courseData)
    }

    const { data: docs } = await supabase
      .from("documents")
      .select("id")
      .eq("course_id", courseId)
      .limit(1)

    if (docs && docs.length > 0) {
      const { data: chunksData } = await supabase
        .from("chunks")
        .select("*")
        .eq("document_id", docs[0].id)
        .order("sequence", { ascending: true })

      if (chunksData) {
        setChunks(chunksData)
      }
    }

    setLoading(false)
  }, [courseId])

  useEffect(() => {
    fetchCourseData()
  }, [fetchCourseData])

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection()
    if (!selection || selection.isCollapsed) {
      setToolbarPosition(null)
      setSelectedText("")
      return
    }

    const text = selection.toString().trim()
    if (text.length < 10) {
      setToolbarPosition(null)
      setSelectedText("")
      return
    }

    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    setSelectedText(text)
    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 - 150
    })
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection)
    return () => document.removeEventListener("mouseup", handleTextSelection)
  }, [handleTextSelection])

  const handleSimplify = () => {
    setExpansion({
      index: currentChunk,
      content: "Think of it like a messy room: without putting in energy to tidy up, things naturally get more disordered. That's entropy - the universe's tendency toward disorder. The second law says this always happens in isolated systems."
    })
    setToolbarPosition(null)
  }

  const handleExpand = () => {
    setExpansion({
      index: currentChunk,
      content: "To understand this more deeply: Entropy is mathematically defined as S = k ln W, where k is Boltzmann's constant and W is the number of possible microscopic states. This equation shows that entropy is fundamentally about probability - there are vastly more ways for a system to be disordered than ordered, so disorder is statistically inevitable."
    })
    setToolbarPosition(null)
  }

  const handleShowDiagram = () => {
    setVisualPanelOpen(true)
    setToolbarPosition(null)
  }

  const handleAskAI = () => {
    setChatOpen(true)
    setToolbarPosition(null)
  }

  const goToPrevChunk = () => {
    if (currentChunk > 0) {
      setCurrentChunk(currentChunk - 1)
      setExpansion(null)
    }
  }

  const goToNextChunk = () => {
    if (currentChunk < chunks.length - 1) {
      setCurrentChunk(currentChunk + 1)
      setExpansion(null)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrevChunk()
      if (e.key === "ArrowRight") goToNextChunk()
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setChatOpen(!chatOpen)
      }
      if (e.key === "Escape") {
        setChatOpen(false)
        setVisualPanelOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentChunk, chunks.length, chatOpen])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-3xl p-12 space-y-4">
          <div className="h-8 w-48 skeleton-shimmer rounded" />
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-full skeleton-shimmer rounded" />
          <div className="h-4 w-3/4 skeleton-shimmer rounded" />
        </div>
      </div>
    )
  }

  const currentContent = chunks[currentChunk]?.content || ""

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-14 border-b border-border bg-surface/50 backdrop-blur-sm flex items-center px-4 sticky top-0 z-40">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </Link>
        <div className="flex-1 text-center">
          <h1 className="font-medium text-foreground truncate max-w-md mx-auto">
            {course?.title || "Course"}
          </h1>
        </div>
        <div className="w-20" />
      </header>

      <div className="flex-1 flex overflow-hidden">
        <main
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            visualPanelOpen ? "max-w-[60%]" : ""
          }`}
        >
          <div className="max-w-[800px] mx-auto px-12 py-16">
            <div
              ref={textCanvasRef}
              className="bg-elevated rounded-xl p-12 shadow-sm border border-border"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentChunk}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.14 }}
                >
                  {currentContent.split("\n\n").map((paragraph, i) => (
                    <div key={i}>
                      <p className="reading-text text-foreground mb-6 last:mb-0">
                        {paragraph}
                      </p>
                      {expansion && expansion.index === currentChunk && i === 0 && (
                        <InlineExpansion
                          content={expansion.content}
                          onDismiss={() => setExpansion(null)}
                        />
                      )}
                    </div>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={goToPrevChunk}
                disabled={currentChunk === 0}
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-1 w-32 bg-surface rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sage transition-all duration-300"
                    style={{ width: `${((currentChunk + 1) / chunks.length) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentChunk + 1} / {chunks.length}
                </span>
              </div>

              <Button
                variant="ghost"
                onClick={goToNextChunk}
                disabled={currentChunk === chunks.length - 1}
                className="gap-2"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </main>

        <VisualPanel
          isOpen={visualPanelOpen}
          onClose={() => setVisualPanelOpen(false)}
          selectedText={selectedText}
        />
      </div>

      <AnimatePresence>
        {toolbarPosition && (
          <SelectionToolbar
            position={toolbarPosition}
            onSimplify={handleSimplify}
            onExpand={handleExpand}
            onShowDiagram={handleShowDiagram}
            onAskAI={handleAskAI}
          />
        )}
      </AnimatePresence>

      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sage hover:bg-sage/90 text-sage-foreground shadow-lg flex items-center justify-center transition-all hover:scale-105 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <ChatDrawer isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  )
}
