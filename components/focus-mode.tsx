"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight, Lock, Wind, Lightbulb, Sparkles, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Topic } from "@/components/topic-input"

export interface SurvivorStep {
  label: string
  description: string
  topics: Topic[]
  color: string
  bgColor: string
  borderColor: string
  iconColor: string
}

interface FocusModeProps {
  steps: SurvivorStep[]
  isPanicMode: boolean
  onRequestBreathing: () => void
  onComplete: () => void
}

export function FocusMode({ steps, isPanicMode, onRequestBreathing, onComplete }: FocusModeProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [currentTopicIndex, setCurrentTopicIndex] = useState(0)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const [showAiHelp, setShowAiHelp] = useState<string | null>(null)

  const currentStep = steps[currentStepIndex]
  const currentTopic = currentStep?.topics[currentTopicIndex]
  const allTopicsInStep = currentStep?.topics ?? []
  const stepProgress = allTopicsInStep.length > 0
    ? allTopicsInStep.filter((t) => completedTopics.has(t.id)).length / allTopicsInStep.length
    : 0

  const markDone = () => {
    if (!currentTopic) return
    setCompletedTopics((prev) => new Set(prev).add(currentTopic.id))
    setShowAiHelp(null)

    // Move to next topic or next step
    if (currentTopicIndex < allTopicsInStep.length - 1) {
      setCurrentTopicIndex((i) => i + 1)
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1)
      setCurrentTopicIndex(0)
    } else {
      onComplete()
    }
  }

  const skipTopic = () => {
    setShowAiHelp(null)
    if (currentTopicIndex < allTopicsInStep.length - 1) {
      setCurrentTopicIndex((i) => i + 1)
    } else if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((i) => i + 1)
      setCurrentTopicIndex(0)
    } else {
      onComplete()
    }
  }

  if (!currentStep || !currentTopic) {
    return (
      <div className="mx-auto w-full max-w-lg animate-scale-in text-center">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8">
          <Heart className="mx-auto mb-4 h-10 w-10 text-primary" aria-hidden="true" />
          <h2 className="font-heading text-2xl font-bold text-foreground">
            {"You did it."}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {"You've covered everything in your plan. You're more prepared than you think."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-lg">
      {/* Survivor Path Progress */}
      <div className="mb-8">
        <div className="flex items-center gap-1" aria-label="Survivor path progress">
          {steps.map((step, i) => (
            <div key={step.label} className="flex flex-1 items-center gap-1">
              <div className="flex-1">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    i < currentStepIndex
                      ? "bg-primary"
                      : i === currentStepIndex
                        ? "bg-primary/60"
                        : "bg-border"
                  }`}
                  style={i === currentStepIndex ? { width: `${Math.max(stepProgress * 100, 10)}%` } : undefined}
                />
                <p className={`mt-1.5 text-xs font-medium ${
                  i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
                }`}>
                  {step.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Focus Card */}
      <div className={`animate-scale-in rounded-2xl border-2 ${currentStep.borderColor} ${currentStep.bgColor} p-6 shadow-sm`}>
        <div className="mb-1 flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${currentStep.color} ${currentStep.bgColor}`}>
            {currentStep.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {currentTopicIndex + 1} of {allTopicsInStep.length}
          </span>
        </div>
        <h2 className={`font-heading mt-3 text-2xl font-bold ${currentStep.color}`}>
          {currentTopic.name}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {isPanicMode
            ? "Focus on just this one thing right now."
            : currentStep.description}
        </p>

        {/* AI Quick Help */}
        {showAiHelp === currentTopic.id && (
          <div className="mt-4 animate-slide-up rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              AI gives you only what{"'"}s most likely to appear in exams.
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {"Focus on the key concepts and definitions first. Try to explain the main idea in one sentence — if you can do that, you understand the core. Skip edge cases for now and prioritize high-frequency exam patterns."}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={markDone}
            className="w-full rounded-xl bg-primary py-5 text-base font-semibold text-primary-foreground shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-md active:scale-[0.98]"
          >
            <CheckCircle2 className="mr-2 h-5 w-5" aria-hidden="true" />
            {"Done, what's next?"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAiHelp(showAiHelp === currentTopic.id ? null : currentTopic.id)}
              className="flex-1 rounded-xl border-border py-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:shadow-sm active:scale-[0.98]"
            >
              <Lightbulb className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Get AI Help (30 sec)
            </Button>
            <Button
              variant="outline"
              onClick={skipTopic}
              className="flex-1 rounded-xl border-border py-4 text-sm text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:text-foreground hover:shadow-sm active:scale-[0.98]"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>

      {/* Upcoming (blurred/locked in panic mode) */}
      {allTopicsInStep.length > 1 && (
        <div className="mt-4" aria-label="Upcoming topics">
          <p className="mb-2 text-xs font-medium text-muted-foreground">Coming up:</p>
          <div className="flex flex-col gap-2">
            {allTopicsInStep.map((topic, i) => {
              if (i <= currentTopicIndex) return null
              const isCompleted = completedTopics.has(topic.id)
              return (
                <div
                  key={topic.id}
                  className={`flex items-center gap-3 rounded-xl border border-border p-3 text-sm ${
                    isPanicMode ? "blur-[3px] opacity-50" : "opacity-70"
                  } transition-all ${isCompleted ? "bg-primary/5" : "bg-card"}`}
                >
                  {isPanicMode ? (
                    <Lock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-border" aria-hidden="true" />
                  )}
                  <span className="text-foreground">{topic.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Mental Reset Button */}
      {isPanicMode && (
        <div className="mt-6 animate-fade-in text-center">
          <Button
            variant="ghost"
            onClick={onRequestBreathing}
            className="group rounded-full px-6 py-4 text-sm text-muted-foreground transition-all hover:bg-primary/5 hover:text-primary"
          >
            <Wind className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
            Need a mental reset?
          </Button>
        </div>
      )}
    </div>
  )
}
