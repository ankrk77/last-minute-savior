"use client"

import { BookOpen, ArrowDown, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  isPanicMode: boolean
  onGetStarted: () => void
}

export function HeroSection({ isPanicMode, onGetStarted }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center px-4 pb-8 pt-14 text-center">
      {/* Soft radial glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background: isPanicMode
            ? "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(199 89% 48% / 0.2), transparent)"
            : "radial-gradient(ellipse 60% 50% at 50% 40%, hsl(199 89% 48% / 0.12), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="animate-fade-in-up relative z-10 flex max-w-xl flex-col items-center gap-4">
        {isPanicMode ? (
          <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-1.5 text-sm font-medium text-red-700 shadow-sm">
            <Zap className="h-4 w-4" aria-hidden="true" />
            <span>Panic Mode Active — Simplified View</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
            <BookOpen className="h-4 w-4 text-primary" aria-hidden="true" />
            <span>Your survival plan is almost ready</span>
          </div>
        )}

        <h2 className="font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
          {isPanicMode
            ? "Deep breath. We'll keep it simple."
            : "Now, tell us what you need to study."}
        </h2>

        <p className="max-w-md text-balance text-base leading-relaxed text-muted-foreground">
          {isPanicMode
            ? "Add your topics below. We'll focus you on what matters most — one thing at a time."
            : "List your topics, rate your confidence, and we'll build your Survivor Path."}
        </p>

        <Button
          size="lg"
          onClick={onGetStarted}
          className="group mt-1 rounded-full bg-primary px-6 py-5 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98]"
        >
          Add my topics
          <ArrowDown className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
        </Button>
      </div>
    </section>
  )
}
