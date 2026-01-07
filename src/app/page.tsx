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
  MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"

const universities = [
  { name: "MIT", logo: "https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg" },
  { name: "Stanford", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b5/Stanford_University_logo.svg" },
  { name: "Harvard", logo: "https://upload.wikimedia.org/wikipedia/commons/7/70/Harvard_University_logo.svg" },
  { name: "Oxford", logo: "https://upload.wikimedia.org/wikipedia/commons/f/ff/Oxford-University-Circlet.svg" }
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
    </svg>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-foreground/10 px-[48px] flex items-center justify-between">
        <div className="w-[120px]">
          <Link href="/" className="text-xl font-bold tracking-tight">Cognify</Link>
        </div>
        <div className="hidden md:flex items-center gap-[24px]">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
        </div>
        <div className="w-[120px] flex justify-end">
          <Link href="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-[1200px] mx-auto px-[48px] w-full grid md:grid-cols-2 gap-[48px] items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[14px] font-bold tracking-wider text-sage uppercase">FOR UNIVERSITY STUDENTS</span>
            <h1 className="text-[48px] font-semibold leading-tight tracking-[-0.03em] mt-4">
              Understand,<br />Don&apos;t Memorize
            </h1>
            <p className="text-lg text-muted-foreground mt-[24px] max-w-[480px]">
              Upload your dense PDF course materials and watch them transform into deeply simplified explanations with interactive 2D visualizations.
            </p>
            <div className="flex items-center gap-4 mt-[32px]">
              <Link href="/signup">
                <Button size="lg" className="bg-sage hover:bg-sage/90 text-sage-foreground px-8">
                  Get Started
                </Button>
              </Link>
              <button className="flex items-center gap-2 text-[16px] font-medium text-sage hover:underline ml-4">
                Watch Demo <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-[48px]">
              <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wider mb-4">Used by students at</p>
                <div className="flex items-center gap-[16px]">
                    {universities.map((uni) => (
                      <div key={uni.name} className="h-10 flex items-center gap-2.5 px-4 text-[11px] font-bold text-muted-foreground">
                        {uni.name === "Stanford" ? (
                          <svg className="w-5 h-5 grayscale opacity-70" viewBox="0 0 32 32" fill="currentColor">
                            <path d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16S24.837 0 16 0zm0 2c7.732 0 14 6.268 14 14s-6.268 14-14 14S2 23.732 2 16 8.268 2 16 2zm-1.5 6v4.5H10v3h4.5V20h3v-4.5H22v-3h-4.5V8h-3z"/>
                          </svg>
                        ) : (
                          <img 
                            src={uni.logo} 
                            alt={`${uni.name} logo`} 
                            className="w-5 h-5 object-contain grayscale opacity-70" 
                          />
                        )}
                        {uni.name}
                      </div>
                    ))}
                </div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full aspect-[3/2] bg-elevated rounded-[16px] border border-foreground/10 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-sage/5 to-transparent" />
            <span className="text-muted-foreground font-medium z-10">[Product Demo Visual]</span>
          </motion.div>
        </div>
      </section>

      {/* BEFORE/AFTER SECTION */}
      <section className="py-[96px] px-[48px]">
        <div className="max-w-[1000px] mx-auto text-center">
          <h2 className="text-[32px] font-bold mb-[48px]">From Dense to Deeply Simple</h2>
          <div className="bg-elevated rounded-[16px] border border-foreground/10 p-[40px] flex flex-col md:flex-row gap-[32px] items-center text-left relative">
            <div className="flex-1 w-full">
              <span className="text-[14px] font-bold text-muted-foreground mb-[12px] block">Before</span>
              <div className="bg-surface border border-border p-[20px] rounded-[8px] h-[300px] overflow-hidden">
                <p className="text-[12px] leading-[1.3] text-muted-foreground">
                  The second law of thermodynamics states that the total entropy of an isolated system can never decrease over time, and is constant if and only if all processes are reversible. Isolated systems spontaneously evolve towards thermodynamic equilibrium, the state with maximum entropy. This implies that natural processes are irreversible and tend towards a state of maximum disorder. The mathematical formulation dS ≥ δQ/T defines the entropy change in relation to heat transfer and absolute temperature. In a closed system, any energy transformation results in some energy being converted into a non-usable form, typically low-grade heat, which increases the overall entropy of the universe. This principle is fundamental to our understanding of the arrow of time and the ultimate fate of cosmic structures...
                </p>
                <div className="h-20 bg-gradient-to-t from-surface to-transparent absolute bottom-[60px] left-[60px] right-[540px]" />
              </div>
            </div>
            
            <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-sage/10 text-sage">
              <ArrowRight className="w-5 h-5" />
            </div>

            <div className="flex-1 w-full">
              <span className="text-[14px] font-bold text-sage mb-[12px] block">After</span>
              <div className="bg-surface border border-sage/20 p-[20px] rounded-[8px] h-[300px] flex flex-col justify-between">
                <p className="text-[16px] leading-[1.6] text-foreground">
                  Think of entropy like a messy room - it naturally gets messier over time, never cleaner by itself. Disorder always increases in closed systems.
                </p>
                <div className="w-full aspect-video bg-sage/5 rounded-[8px] flex items-center justify-center border border-sage/10">
                  <div className="w-32 h-20">
                    <AnimatedDiagram />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-[96px] bg-surface">
        <div className="max-w-[1200px] mx-auto px-[48px]">
          <h2 className="text-[32px] font-bold text-center mb-[64px]">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-[32px]">
            {[
              { title: "Upload PDF", desc: "Drop your course materials or lecture notes", icon: Upload, step: "1" },
              { title: "Get Simplified Text", desc: "AI transforms dense content into clear explanations", icon: FileText, step: "2" },
              { title: "Explore Visualizations", desc: "Interactive 2D diagrams bring concepts to life", icon: LineChart, step: "3" }
            ].map((item) => (
              <div key={item.step} className="bg-elevated p-[32px] rounded-[16px] border border-foreground/10 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className="w-[48px] h-[48px] rounded-full bg-sage/15 flex items-center justify-center text-[20px] font-bold text-sage mb-6">
                  {item.step}
                </div>
                <item.icon className="w-[32px] h-[32px] text-sage" />
                <h3 className="text-[18px] font-semibold mt-[24px] mb-[12px]">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                <div className="w-full aspect-[2/1] bg-muted/30 rounded-[8px] mt-[24px]" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-[96px]">
        <div className="max-w-[1200px] mx-auto px-[48px]">
          <h2 className="text-[32px] font-bold text-center mb-[64px]">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-[32px]">
            {[
              { title: "Text Simplification", desc: "Toggle between technical and 'Explain Like I'm 5' modes for any concept.", icon: Sparkles },
              { title: "2D Visualizations", desc: "Complex processes are automatically mapped to animated, interactive diagrams.", icon: LineChart },
              { title: "AI Chat Assistant", desc: "Ask specific questions about your material and get context-aware answers.", icon: MessageSquare }
            ].map((feature) => (
              <div key={feature.title} className="bg-elevated p-[40px] rounded-[16px] border border-foreground/10 min-h-[400px] flex flex-col">
                <feature.icon className="w-[40px] h-[40px] text-sage" />
                <h3 className="text-[20px] font-semibold mt-[20px] mb-[16px]">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
                <div className="mt-auto w-full h-[200px] bg-muted/20 border border-foreground/5 rounded-[8px] flex items-center justify-center">
                  <span className="text-[12px] text-muted-foreground">[Screenshot Preview]</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-[96px] bg-surface">
        <div className="max-w-[600px] mx-auto px-[48px] text-center">
          <h2 className="text-[32px] font-bold">Start Learning with Clarity</h2>
          <p className="text-muted-foreground mt-[24px]">
            Join students from top universities who finally understand their course material, not just memorize it.
          </p>
          <Link href="/signup">
            <Button size="lg" className="bg-sage hover:bg-sage/90 text-sage-foreground mt-[32px] px-10">
              Try With Your First PDF
            </Button>
          </Link>
          <p className="text-[12px] text-muted-foreground mt-[12px]">
            Free during beta. No credit card.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-[48px] px-[48px] border-t border-foreground/10">
        <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="w-[100px]">
            <span className="font-bold">Cognify</span>
          </div>
          <div className="flex gap-[24px]">
            <Link href="#" className="text-[14px] text-muted-foreground hover:text-sage transition-colors">About</Link>
            <Link href="#" className="text-[14px] text-muted-foreground hover:text-sage transition-colors">Privacy</Link>
            <Link href="#" className="text-[14px] text-muted-foreground hover:text-sage transition-colors">Contact</Link>
          </div>
          <div className="text-[14px] text-muted-foreground">
            support@cognify.edu
          </div>
        </div>
        <div className="text-center mt-[24px] text-[12px] text-muted-foreground">
          © 2026 Cognify. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
