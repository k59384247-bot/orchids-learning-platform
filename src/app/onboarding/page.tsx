"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, 
  Calculator, 
  Atom, 
  History, 
  BookOpen, 
  Code, 
  Stethoscope, 
  Scale,
  Sparkles,
  ArrowRight,
  Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

const domains = [
  { id: "math", label: "Mathematics", icon: Calculator },
  { id: "engineering", label: "Engineering", icon: GraduationCap },
  { id: "physics", label: "Physics", icon: Atom },
  { id: "history", label: "History", icon: History },
  { id: "literature", label: "Literature", icon: BookOpen },
  { id: "cs", label: "Computer Science", icon: Code },
  { id: "medicine", label: "Medicine", icon: Stethoscope },
  { id: "law", label: "Law", icon: Scale },
]

const explanationStyles = [
  { 
    id: "simple", 
    label: "Simple by default",
    description: "ELI5-style explanations that build understanding from basics"
  },
  { 
    id: "technical", 
    label: "More technical",
    description: "Detailed explanations that preserve technical accuracy"
  },
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [selectedStyle, setSelectedStyle] = useState<string>("simple")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      setIsLoading(true)
      
      if (user) {
        await supabase.from("users").update({
          preferences: {
            domain: selectedDomain,
            explanation_style: selectedStyle,
            onboarded: true
          }
        }).eq("id", user.id)
      }
      
      router.push("/dashboard")
    }
  }

  const handleSkip = () => {
    router.push("/dashboard")
  }

  const canProceed = () => {
    if (step === 1) return selectedDomain !== null
    if (step === 2) return selectedStyle !== null
    return true
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-center gap-2 mb-12">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                s === step ? "bg-sage w-8" : s < step ? "bg-sage" : "bg-border"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">What are you studying?</h1>
              <p className="text-muted-foreground mb-8">
                This helps us tailor explanations to your field
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {domains.map((domain) => (
                  <button
                    key={domain.id}
                    onClick={() => setSelectedDomain(domain.id)}
                    className={`p-6 rounded-xl border transition-all duration-200 ${
                      selectedDomain === domain.id
                        ? "border-sage bg-sage/10 shadow-sm"
                        : "border-border bg-elevated hover:border-sage/50"
                    }`}
                  >
                    <domain.icon className={`w-8 h-8 mx-auto mb-3 ${
                      selectedDomain === domain.id ? "text-sage" : "text-muted-foreground"
                    }`} />
                    <span className={`text-sm font-medium ${
                      selectedDomain === domain.id ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {domain.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">How do you prefer explanations?</h1>
              <p className="text-muted-foreground mb-8">
                You can always toggle between styles while reading
              </p>
              
              <div className="space-y-4 max-w-md mx-auto mb-8">
                {explanationStyles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={`w-full p-6 rounded-xl border text-left transition-all duration-200 ${
                      selectedStyle === style.id
                        ? "border-sage bg-sage/10 shadow-sm"
                        : "border-border bg-elevated hover:border-sage/50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        selectedStyle === style.id ? "bg-sage" : "bg-surface"
                      }`}>
                        <Sparkles className={`w-5 h-5 ${
                          selectedStyle === style.id ? "text-sage-foreground" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div>
                        <div className={`font-medium mb-1 ${
                          selectedStyle === style.id ? "text-foreground" : "text-muted-foreground"
                        }`}>
                          {style.label}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {style.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">You&apos;re all set!</h1>
              <p className="text-muted-foreground mb-8">
                Upload your first course PDF to start learning with clarity
              </p>
              
              <div className="max-w-md mx-auto mb-8">
                <div className="border-2 border-dashed border-sage/50 rounded-xl p-12 bg-sage/5 hover:bg-sage/10 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-sage mx-auto mb-4" />
                  <p className="text-foreground font-medium mb-2">
                    Ready to upload your first PDF
                  </p>
                  <p className="text-sm text-muted-foreground">
                    You can do this now or from your dashboard
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground"
          >
            Skip for now
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="bg-sage hover:bg-sage/90 text-sage-foreground gap-2"
          >
            {step === 3 ? (isLoading ? "Setting up..." : "Go to Dashboard") : "Continue"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
