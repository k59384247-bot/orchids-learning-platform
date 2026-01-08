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
  Pause,
  Upload,
  Plus,
  PanelLeft,
  Cuboid,
  Menu,
  FileText
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { supabase, Chunk, Course } from "@/lib/supabase"
import type { ImperativePanelHandle } from "react-resizable-panels"

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
        className="fixed z-50 bg-elevated border border-border/40 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.12)] p-1 flex gap-1"
        style={{ top: position.top - 48, left: position.left }}
      >
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage font-medium"
        onClick={onSimplify}
      >
        <Sparkles className="w-3.5 h-3.5" />
        ELI5
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage font-medium"
        onClick={onExpand}
      >
        <Maximize2 className="w-3.5 h-3.5" />
        Explain More
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage font-medium"
        onClick={onShowDiagram}
      >
        <LineChart className="w-3.5 h-3.5" />
        Diagram
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 px-3 text-xs gap-1.5 hover:bg-sage/10 hover:text-sage font-medium"
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
      transition={{ 
        height: { duration: 0.18, ease: [0.4, 0, 0.2, 1] },
        opacity: { duration: 0.14 }
      }}
      className="my-6 bg-sage/5 border-l-2 border-sage/30 rounded-r-lg p-6 relative group"
    >
      <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-sage opacity-50" />
      <button
        onClick={onDismiss}
        className="absolute top-3 right-3 w-6 h-6 rounded-full bg-surface/50 opacity-0 group-hover:opacity-100 hover:bg-muted flex items-center justify-center transition-all"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 h-4 text-sage mt-1 shrink-0" />
        <p className="reading-text text-foreground/90 italic pr-8 leading-relaxed">{content}</p>
      </div>
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

function DocumentOutline({ 
  chunks, 
  activeIndex, 
  onSelect,
  onClose,
  isCollapsed = false
}: { 
  chunks: Chunk[], 
  activeIndex: number, 
  onSelect: (index: number) => void,
  onClose: () => void,
  isCollapsed?: boolean
}) {
  return (
    <div className={`h-full flex flex-col bg-elevated rounded-xl border border-border/40 shadow-lg m-2 z-10 ${isCollapsed ? "w-[64px]" : ""}`}>
      <div className={`p-4 border-b border-border/40 flex items-center bg-surface/30 rounded-t-xl ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-2">
          <Menu className="w-4 h-4 text-sage" />
          {!isCollapsed && <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Outline</h3>}
        </div>
        {!isCollapsed && (
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {chunks.map((chunk, i) => (
          <button
            key={chunk.id}
            onClick={() => onSelect(i)}
            className={`w-full text-left rounded-lg text-xs transition-all flex items-center gap-3 ${
              isCollapsed ? "justify-center p-2.5" : "px-3 py-2.5"
            } ${
              activeIndex === i 
                ? "bg-sage/10 text-sage font-semibold shadow-sm" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title={isCollapsed ? chunk.content.split("\n")[0].slice(0, 35) : ""}
          >
            <div className={`w-4 h-4 shrink-0 flex items-center justify-center rounded-full border border-current/20 text-[10px] ${activeIndex === i ? "bg-sage/20" : ""}`}>
              {i + 1}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                {chunk.content.split("\n")[0].slice(0, 35)}...
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

function VisualPanel({
  isOpen,
  onClose,
  selectedText,
  isLoading = false,
  isCollapsed = false
}: {
  isOpen: boolean
  onClose: () => void
  selectedText: string
  isLoading?: boolean
  isCollapsed?: boolean
}) {
  const [isPlaying, setIsPlaying] = useState(true)

  return (
    <div className={`h-full flex flex-col bg-elevated rounded-xl border border-border/40 shadow-lg m-2 z-10 overflow-hidden ${isCollapsed ? "w-[64px]" : ""}`}>
      <div className={`p-4 border-b border-border/40 flex items-center bg-surface/30 rounded-t-xl ${isCollapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Cuboid className="w-4 h-4 text-sage" />
            {!isCollapsed && (
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                Visual Context
              </p>
            )}
          </div>
          {!isCollapsed && (
            <p className="text-xs text-foreground/90 truncate italic mt-0.5">
              "{selectedText.slice(0, 60)}{selectedText.length > 60 ? '...' : ''}"
            </p>
          )}
        </div>
        {!isCollapsed && (
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 hover:bg-muted" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 bg-surface/10 relative">
        {isCollapsed ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <LineChart className="w-5 h-5 text-sage opacity-50" />
          </div>
        ) : isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 gap-4">
            <div className="w-full aspect-video skeleton-shimmer rounded-lg opacity-40 shadow-inner" />
            <div className="h-4 w-48 skeleton-shimmer rounded opacity-30" />
            <p className="text-xs text-muted-foreground animate-pulse">Preparing visualization...</p>
          </div>
        ) : (
          <AnimatedDiagram
            isPlaying={isPlaying}
            onToggle={() => setIsPlaying(!isPlaying)}
            onReset={() => setIsPlaying(true)}
          />
        )}
      </div>
    </div>
  )
}

function ChatDrawer({
  isOpen,
  onClose,
  currentChunkTitle
}: {
  isOpen: boolean
  onClose: () => void
  currentChunkTitle?: string
}) {
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
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
    const userMsg = message
    setMessages([...messages, { role: "user", content: userMsg }])
    setMessage("")
    setIsLoading(true)
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Think of entropy like the natural tendency of your room to get messy. Without putting in energy to clean it, things just naturally become more disordered over time. That's essentially what the second law of thermodynamics describes - systems naturally move toward disorder."
      }])
      setIsLoading(false)
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 h-[50vh] bg-elevated border-t border-border/40 rounded-t-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.1)] flex flex-col"
            style={{ backdropFilter: "blur(12px)" }}
          >
            <div className="h-14 border-b border-border/40 flex items-center justify-between px-6 bg-surface/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sage/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sage" />
                </div>
                  <div>
                    <h3 className="text-sm font-semibold">Learning Assistant</h3>
                  </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.length === 1 && !isLoading && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setMessage(suggestion)
                      }}
                      className="p-3 text-xs font-medium text-left rounded-xl border border-border/40 bg-surface/30 hover:bg-surface hover:border-sage/30 transition-all text-muted-foreground hover:text-foreground shadow-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-sage" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-sage text-sage-foreground rounded-tr-none shadow-md"
                        : "bg-surface border border-border/40 rounded-tl-none text-foreground/90 shadow-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-sage/10 border border-sage/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-sage animate-pulse" />
                  </div>
                  <div className="bg-surface border border-border/40 p-4 rounded-2xl rounded-tl-none flex gap-1 shadow-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-sage/40 bounce-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sage/40 bounce-dot" />
                    <div className="w-1.5 h-1.5 rounded-full bg-sage/40 bounce-dot" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-border/40 bg-surface/10">
              <div className="relative max-w-3xl mx-auto">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask about this concept..."
                  className="w-full h-12 max-h-32 px-5 py-3.5 pr-14 bg-elevated border border-border/40 rounded-2xl resize-none text-sm focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage/30 transition-all shadow-inner custom-scrollbar"
                  rows={1}
                />
              <Button
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-sage hover:bg-sage/90 shadow-sm"
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
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
  const [activeChunkIndex, setActiveChunkIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isVisualLoading, setIsVisualLoading] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [selectedParagraph, setSelectedParagraph] = useState<{ chunkId: string; pIndex: number } | null>(null)
  const [toolbarPosition, setToolbarPosition] = useState<SelectionToolbarPosition | null>(null)
  const [expansion, setExpansion] = useState<{ chunkId: string; pIndex: number; content: string } | null>(null)
  const [visualPanelOpen, setVisualPanelOpen] = useState(false)
  const [leftPanelOpen, setLeftPanelOpen] = useState(false)
  const [isLeftPanelCollapsed, setIsLeftPanelCollapsed] = useState(false)
  const [isRightPanelCollapsed, setIsRightPanelCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [isNavHovered, setIsNavHovered] = useState(false)
  const [showSimplified, setShowSimplified] = useState(true)
  const [tempTitle, setTempTitle] = useState("")
  const [isSavingTitle, setIsSavingTitle] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  
  const chunkRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const leftPanelRef = useRef<ImperativePanelHandle>(null)
  const rightPanelRef = useRef<ImperativePanelHandle>(null)

  useEffect(() => {
    const panel = leftPanelRef.current
    if (panel) {
      if (leftPanelOpen) {
        panel.resize(20)
      } else {
        panel.collapse()
      }
    }
  }, [leftPanelOpen])

  useEffect(() => {
    const panel = rightPanelRef.current
    if (panel) {
      if (visualPanelOpen) {
        panel.resize(30)
      } else {
        panel.collapse()
      }
    }
  }, [visualPanelOpen])

  const fetchCourseData = useCallback(async () => {
    if (courseId.startsWith("mock-")) {
      const mockCourse = {
        id: courseId,
        user_id: "mock-user-123",
        title: courseId === "mock-course-1" ? "Introduction to Thermodynamics" : "Advanced Organic Chemistry",
        domain: courseId === "mock-course-1" ? "physics" : "medicine",
        progress: 50,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setCourse(mockCourse)
      setTempTitle(mockCourse.title)
      
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
      setTempTitle(courseData.title)
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"))
            setActiveChunkIndex(index)
          }
        })
      },
      { threshold: 0.3 }
    )

    chunkRefs.current.forEach((ref) => observer.observe(ref))
    return () => observer.disconnect()
  }, [chunks])

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

    // Find the paragraph element to get chunkId and pIndex
    let parent = range.commonAncestorContainer as HTMLElement
    while (parent && !parent.getAttribute?.("data-p-index")) {
      parent = parent.parentElement as HTMLElement
    }

    if (parent) {
      const chunkId = parent.getAttribute("data-chunk-id") || ""
      const pIndex = parseInt(parent.getAttribute("data-p-index") || "0")
      setSelectedParagraph({ chunkId, pIndex })
    }

    setSelectedText(text)
    setToolbarPosition({
      top: rect.top + window.scrollY,
      left: rect.left + rect.width / 2 - 150
    })
  }, [])

  const handleParagraphClick = useCallback((e: React.MouseEvent, chunkId: string, pIndex: number, content: string) => {
    // Only trigger if it's a direct click on the paragraph (white space) or the selection is collapsed
    const selection = window.getSelection()
    if (selection && !selection.isCollapsed) return

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    
    setSelectedText(content)
    setSelectedParagraph({ chunkId, pIndex })
    setToolbarPosition({
      top: rect.top + window.scrollY + 20,
      left: rect.left + rect.width / 2 - 150
    })
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup", handleTextSelection)
    return () => document.removeEventListener("mouseup", handleTextSelection)
  }, [handleTextSelection])

  const handleSimplify = () => {
    if (!selectedParagraph) return
    setExpansion({
      chunkId: selectedParagraph.chunkId,
      pIndex: selectedParagraph.pIndex,
      content: `Simplifying "${selectedText.slice(0, 30)}...": Think of it like a messy room: without putting in energy to tidy up, things naturally get more disordered. This specific concept describes the statistical inevitability of disorder.`
    })
    setToolbarPosition(null)
  }

  const handleExpand = () => {
    if (!selectedParagraph) return
    setExpansion({
      chunkId: selectedParagraph.chunkId,
      pIndex: selectedParagraph.pIndex,
      content: `Expanding on "${selectedText.slice(0, 30)}...": To understand this more deeply, we must look at the microstates. Entropy (S) is fundamentally about probability - there are vastly more ways for a system to be disordered than ordered.`
    })
    setToolbarPosition(null)
  }

  const handleShowDiagram = () => {
    setIsVisualLoading(true)
    setVisualPanelOpen(true)
    setToolbarPosition(null)
    setTimeout(() => setIsVisualLoading(false), 1800)
  }

  const handleAskAI = () => {
    setChatOpen(true)
    setToolbarPosition(null)
  }

  const handleUpdateTitle = async () => {
    if (!tempTitle.trim() || tempTitle === course?.title) {
      setIsPopoverOpen(false)
      return
    }

    setIsSavingTitle(true)

    if (courseId.startsWith("mock-")) {
      if (course) {
        setCourse({ ...course, title: tempTitle })
      }
      setIsSavingTitle(false)
      setIsPopoverOpen(false)
      return
    }

    const { data, error } = await supabase
      .from("courses")
      .update({ title: tempTitle })
      .eq("id", courseId)
      .select()
      .single()

    if (error) {
      console.error("Error updating title:", error)
    } else if (data) {
      setCourse(data)
    }
    setIsSavingTitle(false)
    setIsPopoverOpen(false)
  }

  const scrollToChunk = (index: number) => {
    const chunkId = chunks[index].id
    const element = chunkRefs.current.get(chunkId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollToChunk(Math.max(0, activeChunkIndex - 1))
      if (e.key === "ArrowRight") scrollToChunk(Math.min(chunks.length - 1, activeChunkIndex + 1))
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
  }, [activeChunkIndex, chunks.length, chatOpen])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-3xl p-12 space-y-8">
          <div className="h-10 w-64 skeleton-shimmer rounded-lg" />
          <div className="space-y-4">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-5/6 skeleton-shimmer rounded" />
          </div>
          <div className="space-y-4 pt-8">
            <div className="h-4 w-full skeleton-shimmer rounded" />
            <div className="h-4 w-4/5 skeleton-shimmer rounded" />
          </div>
        </div>
      </div>
    )
  }

    return (
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border/40 bg-surface/40 backdrop-blur-md flex items-center px-4 md:px-6 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-9 w-9 rounded-xl transition-all ${leftPanelOpen ? 'bg-sage/10 text-sage' : 'text-muted-foreground'}`}
            onClick={() => setLeftPanelOpen(!leftPanelOpen)}
            title="Document Outline"
          >
            <Menu className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-border/50 hidden md:block" />
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-sage transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Dashboard</span>
          </Link>
        </div>
          <div className="flex-1 text-center px-2 flex justify-center">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface/60 transition-all max-w-[200px] md:max-w-md mx-auto">
                  <h1 className="text-xs md:text-sm font-semibold text-foreground/90 truncate">
                    {course?.title || "Course Workspace"}
                  </h1>
                  <span className="opacity-0 group-hover:opacity-40 transition-opacity">
                    <Plus className="w-3 h-3 rotate-45" />
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4 bg-elevated border-border/40 shadow-xl" align="center">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Workspace Name
                    </Label>
                    <Input
                      id="title"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      placeholder="Enter workspace name..."
                      className="bg-surface/50 border-border/40 focus:ring-sage/20 focus:border-sage/30 h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleUpdateTitle()
                        if (e.key === "Escape") setIsPopoverOpen(false)
                      }}
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-border/20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setTempTitle(course?.title || "")
                        setIsPopoverOpen(false)
                      }}
                      className="text-xs h-8"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleUpdateTitle}
                      disabled={isSavingTitle || !tempTitle.trim() || tempTitle === course?.title}
                      className="bg-sage hover:bg-sage/90 text-sage-foreground text-xs h-8 px-4"
                    >
                      {isSavingTitle ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="h-2 w-16 md:w-32 bg-surface rounded-full overflow-hidden border border-border/50 hidden sm:block">
            <div
              className="h-full bg-sage transition-all duration-500 ease-out"
              style={{ width: `${((activeChunkIndex + 1) / chunks.length) * 100}%` }}
            />
          </div>
          <div className="w-px h-4 bg-border/50 hidden md:block" />
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-9 w-9 rounded-xl transition-all ${visualPanelOpen ? 'bg-sage/10 text-sage' : 'text-muted-foreground'}`}
              onClick={() => setVisualPanelOpen(!visualPanelOpen)}
              title="Visual Context"
            >
              <Cuboid className="w-4 h-4" />
            </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        <AnimatePresence>
          {leftPanelOpen && (
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl"
            >
              <DocumentOutline 
                chunks={chunks} 
                activeIndex={activeChunkIndex} 
                onSelect={(idx) => {
                  scrollToChunk(idx)
                  setLeftPanelOpen(false)
                }}
                onClose={() => setLeftPanelOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {visualPanelOpen && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-y-0 right-0 z-50 w-full sm:w-80 lg:hidden shadow-2xl"
            >
              <VisualPanel
                isOpen={visualPanelOpen}
                onClose={() => setVisualPanelOpen(false)}
                selectedText={selectedText}
                isLoading={isVisualLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel
              ref={leftPanelRef}
              defaultSize={0}
              minSize={0}
              maxSize={30}
              collapsible={true}
              onCollapse={() => setLeftPanelOpen(false)}
              onExpand={() => setLeftPanelOpen(true)}
              onResize={(size) => {
                if (leftPanelOpen) {
                  setIsLeftPanelCollapsed(size < 12)
                }
              }}
              className={`${leftPanelOpen ? "block" : "hidden"} lg:block`}
            >
              <div className="h-full">
                <DocumentOutline 
                  chunks={chunks} 
                  activeIndex={activeChunkIndex} 
                  onSelect={scrollToChunk}
                  onClose={() => setLeftPanelOpen(false)}
                  isCollapsed={isLeftPanelCollapsed}
                />
              </div>
            </ResizablePanel>

              <ResizableHandle className={`hidden lg:flex ${!leftPanelOpen && "opacity-0 pointer-events-none"}`} />

            <ResizablePanel defaultSize={60} minSize={30}>
              <main 
                ref={scrollContainerRef}
                className="h-full overflow-y-auto scroll-smooth custom-scrollbar bg-background p-6"
              >
                <div className="max-w-[850px] mx-auto mb-6 flex items-center justify-start">
                  <div className="flex items-center gap-3 bg-elevated/40 backdrop-blur-sm px-4 py-2 rounded-xl border border-border/40 shadow-sm">
                    <Switch 
                      id="text-mode" 
                      checked={showSimplified} 
                      onCheckedChange={setShowSimplified}
                      className="data-[state=checked]:bg-sage"
                    />
                    <Label htmlFor="text-mode" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground cursor-pointer select-none">
                      {showSimplified ? "Simplified Text" : "Original Text"}
                    </Label>
                  </div>
                </div>
                <div className="max-w-[850px] mx-auto bg-elevated rounded-2xl border border-border/40 shadow-sm p-8 md:p-12 min-h-full">
                  {chunks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                      <div className="w-20 h-20 bg-sage/5 rounded-3xl border border-sage/10 flex items-center justify-center mb-8">
                        <Plus className="w-10 h-10 text-sage/40" />
                      </div>
                      <h2 className="text-xl font-semibold mb-3">Course is empty</h2>
                      <p className="text-muted-foreground mb-10 max-w-xs leading-relaxed">
                        This course doesn't have any processed content yet.
                      </p>
                      <Link href="/upload">
                        <Button className="bg-sage hover:bg-sage/90 text-sage-foreground px-8 h-12 rounded-xl shadow-lg shadow-sage/10">
                          Upload Document
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    chunks.map((chunk, chunkIndex) => (
                      <div 
                        key={chunk.id} 
                        ref={(el) => { if (el) chunkRefs.current.set(chunk.id, el) }}
                        data-index={chunkIndex}
                        className="relative"
                      >
                        <div className="absolute -left-6 md:-left-12 top-0 bottom-0 w-1 flex flex-col items-center">
                          <div className={`w-2 h-2 rounded-full border-2 transition-all duration-500 ${
                            activeChunkIndex === chunkIndex ? "bg-sage border-sage scale-125" : "bg-transparent border-muted"
                          }`} />
                          <div className="flex-1 w-px bg-muted/30 my-4" />
                        </div>

                          <div className="space-y-8">
                            {chunk.content.split("\n\n").map((paragraph, pIndex) => (
                              <motion.div
                                key={pIndex}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.14, delay: pIndex * 0.1 }}
                                className="relative cursor-pointer"
                                data-chunk-id={chunk.id}
                                data-p-index={pIndex}
                                onClick={(e) => handleParagraphClick(e, chunk.id, pIndex, paragraph)}
                              >
                                <p className="reading-text text-foreground/90 selection:bg-sage/20">
                                  {paragraph}
                                </p>
                                
                                {expansion && expansion.chunkId === chunk.id && expansion.pIndex === pIndex && (
                                   <InlineExpansion
                                     content={expansion.content}
                                     onDismiss={() => setExpansion(null)}
                                   />
                                 )}
   
                                 <div className="mt-8 h-px w-full bg-border/10" />
                               </motion.div>
                             ))}
                           </div>
   
   
                         {chunkIndex < chunks.length - 1 && (
                           <div className="pt-16 md:pt-24 flex items-center justify-center gap-4">
                             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent opacity-30" />
                             <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border/40 to-transparent opacity-30" />
                           </div>
                         )}
                       </div>
                     ))
                   )}
                 </div>
               </main>
             </ResizablePanel>
   
              <ResizableHandle className={`hidden lg:flex ${!visualPanelOpen && "opacity-0 pointer-events-none"}`} />

            <ResizablePanel
              ref={rightPanelRef}
              defaultSize={0}
              minSize={0}
              maxSize={50}
              collapsible={true}
              onCollapse={() => setVisualPanelOpen(false)}
              onExpand={() => setVisualPanelOpen(true)}
              onResize={(size) => {
                if (visualPanelOpen) {
                  setIsRightPanelCollapsed(size < 12)
                }
              }}
              className={`${visualPanelOpen ? "block" : "hidden"} lg:block`}
            >
             <div className="h-full">
               <VisualPanel
                 isOpen={visualPanelOpen}
                 onClose={() => setVisualPanelOpen(false)}
                 selectedText={selectedText}
                 isLoading={isVisualLoading}
                 isCollapsed={isRightPanelCollapsed}
               />
             </div>
           </ResizablePanel>
          </ResizablePanelGroup>
       </div>
 
       <div 
         className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-all duration-300"
         onMouseEnter={() => setIsNavHovered(true)}
         onMouseLeave={() => setIsNavHovered(false)}
       >
         <div className={`bg-elevated/80 backdrop-blur-xl border border-border/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] rounded-2xl flex items-center p-1.5 transition-all duration-300 ${
           isNavHovered ? "opacity-100 scale-100" : "opacity-40 scale-95 hover:opacity-100 hover:scale-100"
         }`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToChunk(Math.max(0, activeChunkIndex - 1))}
            disabled={activeChunkIndex === 0}
            className={`h-10 w-10 rounded-xl transition-all ${
              isNavHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <div className="px-4 flex flex-col items-center min-w-[120px]">
            <div className="h-1 w-24 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full bg-sage transition-all duration-300"
                style={{ width: `${((activeChunkIndex + 1) / chunks.length) * 100}%` }}
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => scrollToChunk(Math.min(chunks.length - 1, activeChunkIndex + 1))}
            disabled={activeChunkIndex === chunks.length - 1}
            className={`h-10 w-10 rounded-xl transition-all ${
              isNavHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
            }`}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
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
          className="fixed bottom-8 right-8 w-14 h-14 rounded-2xl bg-sage hover:bg-sage/90 text-sage-foreground shadow-xl shadow-sage/20 flex items-center justify-center transition-all hover:scale-105 hover:-rotate-3 z-40"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      <ChatDrawer 
        isOpen={chatOpen} 
        onClose={() => setChatOpen(false)} 
        currentChunkTitle={course?.title}
      />
    </div>
  )
}
