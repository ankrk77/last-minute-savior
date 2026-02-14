"use client"

import { AlertTriangle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Topic } from "@/components/topic-input"

interface RealityCheckProps {
  topics: Topic[]
  examCloseness: number
  onContinue: () => void
  onGoBack: () => void
}

export function RealityCheck({ topics, examCloseness, onContinue, onGoBack }: RealityCheckProps) {
  const hardTopics = topics.filter((t) => t.confidence <= 2)
  const isUnrealistic = examCloseness <= 1 && hardTopics.length > 4

  if (!isUnrealistic) return null

  const realisticCount = Math.min(hardTopics.length, 3)

  return (
    <div className="mx-auto w-full max-w-xl animate-slide-up">
      <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
            <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-amber-800">
              Honest reality check
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-amber-700">
              You have {hardTopics.length} tough topics and very little time.{" "}
              {"That's a lot to cover in one sitting. Here's what's actually possible:"}
            </p>
            <div className="mt-3 rounded-xl bg-amber-100/60 p-3">
              <p className="text-sm font-medium text-amber-800">
                We recommend focusing on your top {realisticCount} weakest topics. The rest can be quickly skimmed or safely skipped.
              </p>
            </div>
            <p className="mt-3 text-xs italic text-amber-600">
              {"This isn't about being perfect. It's about being strategic."}
            </p>
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <Button
            onClick={onContinue}
            className="flex-1 rounded-xl bg-amber-600 py-4 text-sm font-semibold text-amber-50 shadow transition-all duration-200 hover:bg-amber-700 hover:scale-[1.02] active:scale-[0.98]"
          >
            Got it, generate my plan
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            onClick={onGoBack}
            className="rounded-xl border-amber-300 py-4 text-sm text-amber-700 transition-all duration-200 hover:bg-amber-100 active:scale-[0.98]"
          >
            Edit topics
          </Button>
        </div>
      </div>
    </div>
  )
}
