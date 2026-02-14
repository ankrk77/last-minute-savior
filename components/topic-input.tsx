"use client"

import { useState, useRef, useEffect } from "react"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export interface Topic {
  id: string
  name: string
  confidence: number
}

const confidenceLevels = [
  { value: 1, label: "Lost", color: "bg-red-500", ring: "ring-red-500/30" },
  { value: 2, label: "Shaky", color: "bg-orange-500", ring: "ring-orange-500/30" },
  { value: 3, label: "Okay", color: "bg-yellow-500", ring: "ring-yellow-500/30" },
  { value: 4, label: "Good", color: "bg-emerald-400", ring: "ring-emerald-400/30" },
  { value: 5, label: "Solid", color: "bg-emerald-600", ring: "ring-emerald-600/30" },
]

interface TopicInputProps {
  topics: Topic[]
  onAddTopic: (topic: Topic) => void
  onRemoveTopic: (id: string) => void
}

export function TopicInput({ topics, onAddTopic, onRemoveTopic }: TopicInputProps) {
  const [topicName, setTopicName] = useState("")
  const [confidence, setConfidence] = useState(3)
  const inputRef = useRef<HTMLInputElement>(null)
  const [justAdded, setJustAdded] = useState<string | null>(null)

  const handleAdd = () => {
    if (!topicName.trim()) return
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      name: topicName.trim(),
      confidence,
    }
    onAddTopic(newTopic)
    setTopicName("")
    setConfidence(3)
    setJustAdded(newTopic.id)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (justAdded) {
      const timer = setTimeout(() => setJustAdded(null), 500)
      return () => clearTimeout(timer)
    }
  }, [justAdded])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <section className="mx-auto w-full max-w-xl" aria-labelledby="topic-input-heading">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
        <h2 id="topic-input-heading" className="font-heading mb-1 text-xl font-semibold text-foreground">
          Add your topics
        </h2>
        <p className="mb-5 text-sm text-muted-foreground">
          List every subject or chapter, then rate how confident you feel.
        </p>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={topicName}
              onChange={(e) => setTopicName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Recursion, Thermodynamics, DBMS Normalization..."
              className="flex-1 rounded-xl border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Topic name"
            />
            <Button
              onClick={handleAdd}
              disabled={!topicName.trim()}
              size="icon"
              className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground shadow transition-all duration-150 hover:scale-105 hover:bg-primary/90 active:scale-95 disabled:opacity-40"
              aria-label="Add topic"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Confidence selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {"How confident do you feel?"}
            </label>
            <div className="flex gap-2" role="radiogroup" aria-label="Confidence level">
              {confidenceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  role="radio"
                  aria-checked={confidence === level.value}
                  aria-label={`${level.label} - confidence ${level.value} of 5`}
                  onClick={() => setConfidence(level.value)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-xs font-medium transition-all duration-150 hover:scale-105 active:scale-95 ${
                    confidence === level.value
                      ? `border-transparent ${level.color} text-card ring-4 ${level.ring}`
                      : "border-border bg-secondary text-muted-foreground hover:border-muted-foreground/30"
                  }`}
                >
                  <span className="text-base" aria-hidden="true">
                    {level.value}
                  </span>
                  <span className={confidence === level.value ? "text-card" : ""}>{level.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Topic chips */}
      {topics.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Added topics">
          {topics.map((topic) => {
            const level = confidenceLevels.find((l) => l.value === topic.confidence)
            return (
              <div
                key={topic.id}
                role="listitem"
                className={`group flex items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-3 pr-1.5 text-sm font-medium text-foreground shadow-sm transition-all duration-200 ${
                  justAdded === topic.id ? "animate-fade-in-up" : ""
                }`}
              >
                <span
                  className={`inline-block h-2.5 w-2.5 rounded-full ${level?.color ?? "bg-muted"}`}
                  aria-hidden="true"
                />
                <span>{topic.name}</span>
                <button
                  onClick={() => onRemoveTopic(topic.id)}
                  className="ml-0.5 rounded-full p-1 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive"
                  aria-label={`Remove ${topic.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
