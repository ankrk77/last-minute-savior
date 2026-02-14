"use client"

import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GenerateButtonProps {
  onGenerate: () => void
  isLoading: boolean
  disabled: boolean
}

export function GenerateButton({ onGenerate, isLoading, disabled }: GenerateButtonProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <Button
        onClick={onGenerate}
        disabled={disabled || isLoading}
        size="lg"
        className="group relative overflow-hidden rounded-full bg-primary px-10 py-6 text-base font-semibold text-primary-foreground shadow-lg transition-all duration-200 hover:scale-[1.03] hover:shadow-xl active:scale-[0.97] disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
            Building your path...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5 transition-transform duration-200 group-hover:rotate-12" aria-hidden="true" />
            Generate Survivor Path
          </>
        )}
      </Button>
      {disabled && !isLoading && (
        <p className="text-sm text-muted-foreground" role="status">
          Add at least one topic to get started
        </p>
      )}
    </div>
  )
}
