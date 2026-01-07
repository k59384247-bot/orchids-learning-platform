"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Upload, 
  FileText, 
  LineChart, 
  Sparkles, 
  ArrowRight, 
  Play,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

const universities = [
  "MIT", "Stanford", "Harvard", "Oxford", "Cambridge"
]

function AnimatedDiagram() {
  const [active, setActive] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % 4)
    }, 1500)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full">
      <defs>
        <linearGradient id="sage-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--sage)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--sage)" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      
      <motion.rect 
        x="20" y="30" width="40" height="60" rx="4"
        fill="url(#sage-gradient)"
        animate={{ opacity: active === 0 ? 1 : 0.3 }}
        transition={{ duration: 0.3 }}
      />
      <motion.path 
        d="M70 60 L90 60" 
        stroke="var(--sage)" 
        strokeWidth="2"
        strokeDasharray="4 2"
        animate={{ opacity: active >= 1 ? 1 : 0.3 }}
      />
      <motion.circle 
        cx="110" cy="60" r="20"
        fill="none"
        stroke="var(--sage)"
        strokeWidth="2"
        animate={{ opacity: active >= 1 ? 1 : 0.3, scale: active === 1 ? 1.1 : 1 }}
        style={{ transformOrigin: "110px 60px" }}
      />
      <motion.path 
        d="M130 60 L150 60" 
        stroke="var(--sage)" 
        strokeWidth="2"
        strokeDasharray="4 2"
        animate={{ opacity: active >= 2 ? 1 : 0.3 }}
      />
      <motion.polygon
        points="180,40 160,80 170,60"
        fill="url(#sage-gradient)"
        animate={{ opacity: active >= 2 ? 1 : 0.3 }}
      />
      
      <motion.text x="40" y="110" textAnchor="middle" className="text-[8px] fill-muted-foreground">Input</motion.text>
      <motion.text x="110" y="110" textAnchor="middle" className="text-[8px] fill-muted-foreground">Process</motion.text>
      <motion.text x="170" y="110" textAnchor="middle" className="text-[8px] fill-muted-foreground">Visual</motion.text>
    </svg>
  )
}

function BeforeAfterCard() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="w-full max-w-[1200px] mx-auto bg-elevated rounded-xl border border-border overflow-hidden shadow-sm"
    >
      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="p-8">
          <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-xs">B</span>
            Before
          </div>
          <div className="text-sm leading-tight text-muted-foreground/70 font-mono" style={{ lineHeight: "1.3" }}>
            The second law of thermodynamics states that the total entropy of an isolated system can never decrease over time, and is constant if and only if all processes are reversible. Isolated systems spontaneously evolve towards thermodynamic equilibrium, the state with maximum entropy. The entropy change dS of a system undergoing a reversible process is dS = δQ/T, where δQ is the heat absorbed and T is the absolute temperature.
          </div>
        </div>
        
        <div className="p-8 bg-surface/50">
          <div className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-sage/10 text-sage flex items-center justify-center text-xs">A</span>
            After
          </div>
          <div className="space-y-4">
            <div className="text-base leading-relaxed text-foreground">
              Think of entropy like a messy room - it naturally gets messier over time, never cleaner by itself. That&apos;s the second law: disorder always increases in closed systems.
            </div>
            <div className="w-full h-24 bg-surface rounded-lg flex items-center justify-center">
              <AnimatedDiagram />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const howItWorks = [
  {
    icon: Upload,
    title: "Upload PDF",
    description: "Drop your course materials, textbooks, or lecture notes",
    step: "01"
  },
  {
    icon: FileText,
    title: "Get Simplified Text",
    description: "AI transforms dense content into clear explanations",
    step: "02"
  },
  {
    icon: LineChart,
    title: "Explore Visualizations",
    description: "Interactive 2D diagrams bring concepts to life",
    step: "03"
  }
]

const features = [
  {
    title: "Text Simplification",
    description: "Toggle between ELI5 and technical explanations",
    preview: (
      <div className="bg-surface rounded-lg p-4 space-y-2">
        <div className="flex gap-2">
          <div className="px-3 py-1.5 bg-sage/10 text-sage rounded-full text-xs font-medium">Simple</div>
          <div className="px-3 py-1.5 bg-muted text-muted-foreground rounded-full text-xs">Technical</div>
        </div>
        <div className="h-16 bg-elevated rounded animate-pulse" />
      </div>
    )
  },
  {
    title: "2D Visualizations",
    description: "Animated diagrams that explain complex processes",
    preview: (
      <div className="bg-surface rounded-lg p-4 h-28 flex items-center justify-center">
        <AnimatedDiagram />
      </div>
    )
  },
  {
    title: "AI Chat Assistant",
    description: "Ask questions about any part of your material",
    preview: (
      <div className="bg-surface rounded-lg p-4 space-y-2">
        <div className="flex gap-2 items-start">
          <div className="w-6 h-6 rounded-full bg-sage/20 shrink-0" />
          <div className="bg-elevated rounded-lg p-2 text-xs text-muted-foreground">Explain entropy simply</div>
        </div>
        <div className="flex gap-2 items-start justify-end">
          <div className="bg-sage/10 rounded-lg p-2 text-xs text-foreground">Think of it like a messy room...</div>
          <div className="w-6 h-6 rounded-full bg-sage shrink-0" />
        </div>
      </div>
    )
  }
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-foreground">
            Cognify
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-sage hover:bg-sage/90 text-sage-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-5xl font-bold text-foreground leading-tight mb-6"
              >
                Understand,<br />Don&apos;t Memorize
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-xl text-muted-foreground mb-4"
              >
                For university students tackling complex coursework
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base text-muted-foreground/80 mb-8 leading-relaxed"
              >
                Upload your dense PDF course materials and watch them transform into deeply simplified explanations with interactive 2D visualizations. Finally understand the concepts, not just memorize the formulas.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link href="/signup">
                  <Button size="lg" className="bg-sage hover:bg-sage/90 text-sage-foreground gap-2">
                    Try with Your First PDF
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="gap-2">
                  <Play className="w-4 h-4" />
                  See How It Works
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <span>Used by students at</span>
                <div className="flex gap-4">
                  {universities.map((uni) => (
                    <span key={uni} className="font-medium text-foreground/60">{uni}</span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-16 px-6">
          <BeforeAfterCard />
        </section>

        <section className="py-24 px-6 bg-surface/50">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16"
            >
              How It Works
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="absolute -top-4 -left-4 text-6xl font-bold text-sage/10">{item.step}</div>
                  <div className="bg-elevated rounded-xl p-8 border border-border hover:shadow-lg transition-shadow duration-300 relative z-10">
                    <div className="w-12 h-12 bg-sage/10 rounded-lg flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-sage" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-center mb-16"
            >
              Core Features
            </motion.h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="bg-elevated rounded-xl border border-border overflow-hidden h-[400px] flex flex-col hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6 flex-1">
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{feature.description}</p>
                    {feature.preview}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface/50">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Sparkles className="w-12 h-12 text-sage mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Start Learning with Clarity</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of students who finally understand their coursework.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-sage hover:bg-sage/90 text-sage-foreground gap-2">
                  Try with Your First PDF
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-sm text-muted-foreground mt-4">
                Free during beta. No credit card required.
              </p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Cognify - Understand, Don&apos;t Memorize
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
