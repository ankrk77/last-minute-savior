"use client"

import { useState, useRef, useCallback } from "react"
import { PanicDetector, type PanicState } from "@/components/panic-detector"
import { HeroSection } from "@/components/hero-section"
import { TopicInput, type Topic } from "@/components/topic-input"
import { GenerateButton } from "@/components/generate-button"
import { RealityCheck } from "@/components/reality-check"
import { FocusMode, type SurvivorStep } from "@/components/focus-mode"
import { BreathingExercise } from "@/components/breathing-exercise"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

type AppScreen = "panic-detect" | "input" | "reality-check" | "loading" | "focus" | "done"

function buildSurvivorSteps(topics: Topic[]): SurvivorStep[] {
  const mustStudy = topics.filter((t) => t.confidence <= 2)
  const reviseIfTime = topics.filter((t) => t.confidence === 3)
  const optional = topics.filter((t) => t.confidence >= 4)

  const steps: SurvivorStep[] = []

  if (mustStudy.length > 0) {
    steps.push({
      label: "Start Here",
      description: "Must-do topics. These need your attention the most.",
      topics: mustStudy,
      color: "text-red-700",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
    })
  }

  if (reviseIfTime.length > 0) {
    steps.push({
      label: "If Time Left",
      description: "Helpful but not critical. A quick pass can boost your score.",
      topics: reviseIfTime,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
    })
  }

  if (optional.length > 0) {
    steps.push({
      label: "Optional",
      description: "Only if calm. You already know these well.",
      topics: optional,
      color: "text-emerald-700",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-600",
    })
  }

  return steps
}

export default function Page() {
  const [screen, setScreen] = useState<AppScreen>("panic-detect")
  const [panicState, setPanicState] = useState<PanicState | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [showBreathing, setShowBreathing] = useState(false)
  const [showRealityCheck, setShowRealityCheck] = useState(false)
  const inputSectionRef = useRef<HTMLDivElement>(null)

  const isPanicMode = panicState?.isPanicMode ?? false

  const handlePanicComplete = useCallback((state: PanicState) => {
    setPanicState(state)
    setScreen("input")
  }, [])

  const scrollToInput = useCallback(() => {
    inputSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }, [])

  const handleAddTopic = useCallback((topic: Topic) => {
    setTopics((prev) => [...prev, topic])
    setShowRealityCheck(false)
  }, [])

  const handleRemoveTopic = useCallback((id: string) => {
    setTopics((prev) => prev.filter((t) => t.id !== id))
    setShowRealityCheck(false)
  }, [])

  const handleGenerate = useCallback(() => {
    // Check if reality check should show
    const hardTopics = topics.filter((t) => t.confidence <= 2)
    if ((panicState?.examCloseness ?? 3) <= 1 && hardTopics.length > 4 && !showRealityCheck) {
      setShowRealityCheck(true)
      return
    }

    setScreen("loading")
    setTimeout(() => {
      setScreen("focus")
    }, 1400)
  }, [topics, panicState, showRealityCheck])

  const handleReset = useCallback(() => {
    setTopics([])
    setPanicState(null)
    setScreen("panic-detect")
    setShowRealityCheck(false)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const survivorSteps = buildSurvivorSteps(topics)

  // Panic Detection Screen
  if (screen === "panic-detect") {
    return (
      <main className="min-h-screen">
        <PanicDetector onComplete={handlePanicComplete} />
      </main>
    )
  }

  // Loading screen
  if (screen === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="animate-scale-in flex flex-col items-center gap-4 text-center">
          <div className="relative h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          </div>
          <div>
            <p className="font-heading text-lg font-semibold text-foreground">
              Building your Survivor Path
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isPanicMode
                ? "Simplifying everything for maximum focus..."
                : "Prioritizing topics based on your confidence levels..."}
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Focus Mode
  if (screen === "focus" || screen === "done") {
    return (
      <main className="min-h-screen px-4 py-10">
        {showBreathing && (
          <BreathingExercise onClose={() => setShowBreathing(false)} />
        )}

        {screen === "done" ? (
          <div className="mx-auto max-w-lg animate-scale-in text-center">
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <svg className="h-7 w-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                {"You've completed your Survivor Path"}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {"You showed up, made a plan, and followed through. That takes courage. You're more prepared than you think — go show that exam what you've got."}
              </p>
              <Button
                onClick={handleReset}
                className="mt-6 rounded-full bg-primary px-6 py-5 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Start a New Plan
              </Button>
            </div>
          </div>
        ) : (
          <FocusMode
            steps={survivorSteps}
            isPanicMode={isPanicMode}
            onRequestBreathing={() => setShowBreathing(true)}
            onComplete={() => setScreen("done")}
          />
        )}

        {/* Footer */}
        <footer className="mt-16 border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
  <p>
    {"Made with care for students everywhere"}
  </p>
  <p className="mt-2 italic text-muted-foreground/70">
    Built for students under pressure, not productivity perfection.
  </p>
</footer>
      </main>
    )
  }

  // Input Screen (default)
  return (
    <main className="min-h-screen">
      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} />
      )}

      {/* Hero */}
      <HeroSection isPanicMode={isPanicMode} onGetStarted={scrollToInput} />

      {/* Topic Input */}
      <div ref={inputSectionRef} className="px-4 pb-10">
        <TopicInput
          topics={topics}
          onAddTopic={handleAddTopic}
          onRemoveTopic={handleRemoveTopic}
        />
      </div>

      {/* Reality Check */}
      {showRealityCheck && (
        <div className="px-4 pb-8">
          <RealityCheck
            topics={topics}
            examCloseness={panicState?.examCloseness ?? 3}
            onContinue={() => {
              setShowRealityCheck(false)
              setScreen("loading")
              setTimeout(() => setScreen("focus"), 1400)
            }}
            onGoBack={() => {
              setShowRealityCheck(false)
              scrollToInput()
            }}
          />
        </div>
      )}

      {/* Generate Button */}
      {topics.length > 0 && !showRealityCheck && (
        <div className="animate-fade-in-up px-4 pb-8">
          <GenerateButton
            onGenerate={handleGenerate}
            isLoading={false}
            disabled={topics.length === 0}
          />
        </div>
      )}

      {/* Panic mode: breathing shortcut */}
      {isPanicMode && topics.length === 0 && (
        <div className="animate-fade-in px-4 pb-8 text-center">
          <button
            onClick={() => setShowBreathing(true)}
            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground shadow-sm transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:shadow-md active:scale-[0.97]"
          >
            Feeling overwhelmed? Try a quick breathing exercise
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
  <p>
    {"Made with care for students everywhere"}
  </p>
  <p className="mt-2 italic text-muted-foreground/70">
    Built for students under pressure, not productivity perfection.
  </p>
</footer>
    </main>
  )
}
