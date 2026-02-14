"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { X, Wind } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BreathingExerciseProps {
  onClose: () => void
}

const PHASES = [
  { label: "Breathe in", duration: 4000, scale: "scale-[1.6]", color: "text-primary" },
  { label: "Hold", duration: 4000, scale: "scale-[1.6]", color: "text-accent" },
  { label: "Breathe out", duration: 6000, scale: "scale-100", color: "text-primary" },
]

export function BreathingExercise({ onClose }: BreathingExerciseProps) {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const totalCycles = 3

  const start = useCallback(() => {
    setIsActive(true)
    setPhase(0)
    setCycle(0)
  }, [])

  useEffect(() => {
    if (!isActive) return

    const currentPhase = PHASES[phase]
    const durationSec = Math.round(currentPhase.duration / 1000)
    setCountdown(durationSec)

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) return 0
        return prev - 1
      })
    }, 1000)

    const phaseTimer = setTimeout(() => {
      if (timerRef.current) clearInterval(timerRef.current)
      const nextPhase = phase + 1
      if (nextPhase >= PHASES.length) {
        const nextCycle = cycle + 1
        if (nextCycle >= totalCycles) {
          setIsActive(false)
          return
        }
        setCycle(nextCycle)
        setPhase(0)
      } else {
        setPhase(nextPhase)
      }
    }, currentPhase.duration)

    return () => {
      clearTimeout(phaseTimer)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isActive, phase, cycle])

  const currentPhase = PHASES[phase]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-fade-in">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        aria-label="Close breathing exercise"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="flex w-full max-w-sm flex-col items-center gap-8 px-4 text-center">
        {!isActive && cycle === 0 && (
          <div className="animate-slide-up flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <Wind className="h-8 w-8 text-primary" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Quick Mental Reset
              </h2>
              <p className="mt-2 text-muted-foreground">
                {"Take 45 seconds to calm your mind. You'll focus better after this."}
              </p>
            </div>
            <Button
              onClick={start}
              size="lg"
              className="rounded-full bg-primary px-8 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            >
              Start Breathing
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              Prefer something interactive? Try a 30-second focus tap.
            </p>
          </div>
        )}

        {isActive && (
          <div className="flex flex-col items-center gap-8 animate-fade-in">
            {/* Breathing circle */}
            <div className="relative flex h-48 w-48 items-center justify-center">
              <div
                className={`absolute inset-0 rounded-full bg-primary/10 transition-transform ease-in-out ${currentPhase.scale}`}
                style={{ transitionDuration: `${currentPhase.duration}ms` }}
                aria-hidden="true"
              />
              <div
                className={`absolute inset-4 rounded-full bg-primary/20 transition-transform ease-in-out ${currentPhase.scale}`}
                style={{ transitionDuration: `${currentPhase.duration * 0.9}ms` }}
                aria-hidden="true"
              />
              <div className="relative z-10 flex flex-col items-center gap-1">
                <span className={`text-3xl font-bold tabular-nums ${currentPhase.color}`}>
                  {countdown}
                </span>
              </div>
            </div>

            <div>
              <p className={`text-xl font-semibold ${currentPhase.color}`} role="status" aria-live="polite">
                {currentPhase.label}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Round {cycle + 1} of {totalCycles}
              </p>
            </div>
          </div>
        )}

        {!isActive && cycle > 0 && (
          <div className="animate-scale-in flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15">
              <Wind className="h-8 w-8 text-accent" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-foreground">
                Feeling better?
              </h2>
              <p className="mt-2 text-muted-foreground">
                {"Your mind is clearer now. Let's get back to it."}
              </p>
            </div>
            <Button
              onClick={onClose}
              size="lg"
              className="rounded-full bg-accent px-8 py-6 text-base font-semibold text-accent-foreground shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
            >
              Back to Studying
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
