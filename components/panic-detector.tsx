"use client"

import { useState } from "react"
import { Clock, Brain, ArrowRight, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface PanicState {
  examCloseness: number // 1=tomorrow, 2=2-3 days, 3=week+
  stressLevel: number // 1=calm, 2=nervous, 3=panicking
  isPanicMode: boolean
}

interface PanicDetectorProps {
  onComplete: (state: PanicState) => void
}

const examOptions = [
  { value: 1, label: "Tomorrow or less", icon: Zap, desc: "Under 24 hours" },
  { value: 2, label: "2-3 days away", icon: Clock, desc: "A bit of time left" },
  { value: 3, label: "A week or more", icon: Clock, desc: "Some breathing room" },
]

const stressOptions = [
  { value: 3, label: "Full panic", color: "border-red-300 bg-red-50 text-red-700 hover:bg-red-100" },
  { value: 2, label: "Pretty nervous", color: "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100" },
  { value: 1, label: "Mostly calm", color: "border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" },
]

export function PanicDetector({ onComplete }: PanicDetectorProps) {
  const [step, setStep] = useState(0)
  const [examCloseness, setExamCloseness] = useState<number | null>(null)
  const [stressLevel, setStressLevel] = useState<number | null>(null)

  const handleExamSelect = (value: number) => {
    setExamCloseness(value)
    setTimeout(() => setStep(1), 300)
  }

  const handleStressSelect = (value: number) => {
    setStressLevel(value)
    const isPanic = value >= 2 && (examCloseness ?? 3) <= 2
    setTimeout(() => {
      onComplete({
        examCloseness: examCloseness ?? 3,
        stressLevel: value,
        isPanicMode: isPanic,
      })
    }, 400)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header - always visible */}
        <div className="mb-10 text-center animate-fade-in-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
            <Brain className="h-7 w-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Last-Minute Savior
          </h1>
          <p className="mt-2 text-muted-foreground">
            {"Let's figure out what you need right now."}
          </p>
        </div>

        {/* Step 0: Exam closeness */}
        {step === 0 && (
          <div className="animate-slide-up">
            <p className="mb-4 text-center text-sm font-medium text-foreground">
              How close is your exam?
            </p>
            <div className="flex flex-col gap-3" role="radiogroup" aria-label="Exam closeness">
              {examOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={examCloseness === option.value}
                    onClick={() => handleExamSelect(option.value)}
                    className={`group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                      examCloseness === option.value
                        ? "border-primary bg-primary/5 shadow-md"
                        : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                      examCloseness === option.value ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground group-hover:text-primary"
                    }`}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.desc}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" aria-hidden="true" />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Step 1: Stress level */}
        {step === 1 && (
          <div className="animate-slide-up">
            <p className="mb-4 text-center text-sm font-medium text-foreground">
              How are you feeling right now?
            </p>
            <div className="flex flex-col gap-3" role="radiogroup" aria-label="Stress level">
              {stressOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={stressLevel === option.value}
                  onClick={() => handleStressSelect(option.value)}
                  className={`rounded-2xl border-2 p-4 text-center text-base font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${option.color} ${
                    stressLevel === option.value ? "ring-4 ring-primary/20 shadow-md" : ""
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Button
              variant="ghost"
              onClick={() => setStep(0)}
              className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground"
            >
              Go back
            </Button>
          </div>
        )}

        {/* Progress dots */}
        <div className="mt-8 flex items-center justify-center gap-2" aria-hidden="true">
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 0 ? "w-8 bg-primary" : "w-2 bg-border"}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? "w-8 bg-primary" : "w-2 bg-border"}`} />
        </div>
      </div>
    </div>
  )
}
