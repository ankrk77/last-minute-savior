"use client"

import { Flame, AlertTriangle, CheckCircle2, Heart } from "lucide-react"
import type { Topic } from "@/components/topic-input"

interface ResultSectionProps {
  topics: Topic[]
}

interface PriorityGroup {
  title: string
  subtitle: string
  supportMessage: string
  icon: React.ReactNode
  bgClass: string
  borderClass: string
  iconBgClass: string
  textClass: string
  badgeClass: string
  topics: Topic[]
}

export function ResultSection({ topics }: ResultSectionProps) {
  const mustStudy = topics.filter((t) => t.confidence <= 2)
  const reviseIfTime = topics.filter((t) => t.confidence === 3)
  const skipForNow = topics.filter((t) => t.confidence >= 4)

  const groups: PriorityGroup[] = [
    {
      title: "Must Study Now",
      subtitle: "These need your attention the most",
      supportMessage:
        "It's okay to feel behind. Starting is the hardest part, and you're doing it right now.",
      icon: <Flame className="h-5 w-5" aria-hidden="true" />,
      bgClass: "bg-red-50",
      borderClass: "border-red-200",
      iconBgClass: "bg-red-100 text-red-600",
      textClass: "text-red-700",
      badgeClass: "bg-red-100 text-red-700",
      topics: mustStudy,
    },
    {
      title: "Revise If Time",
      subtitle: "A quick skim could help",
      supportMessage:
        "You know more than you think. A quick review is all these need.",
      icon: <AlertTriangle className="h-5 w-5" aria-hidden="true" />,
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      iconBgClass: "bg-amber-100 text-amber-600",
      textClass: "text-amber-700",
      badgeClass: "bg-amber-100 text-amber-700",
      topics: reviseIfTime,
    },
    {
      title: "Skip For Now",
      subtitle: "You've got this covered",
      supportMessage:
        "Great job preparing these! Trust your knowledge and save energy for what matters.",
      icon: <CheckCircle2 className="h-5 w-5" aria-hidden="true" />,
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200",
      iconBgClass: "bg-emerald-100 text-emerald-600",
      textClass: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-700",
      topics: skipForNow,
    },
  ]

  return (
    <section className="mx-auto w-full max-w-2xl" aria-labelledby="results-heading">
      {/* Supportive header */}
      <div className="mb-8 text-center animate-fade-in-up">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Heart className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <h2 id="results-heading" className="font-heading text-2xl font-bold text-foreground sm:text-3xl">
          {"Your personalized plan is ready"}
        </h2>
        <p className="mt-2 text-balance text-muted-foreground">
          {"Remember: you don't need to know everything. Focus on what moves the needle."}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map((group, groupIndex) => (
          <div
            key={group.title}
            className={`animate-fade-in-up rounded-2xl border ${group.borderClass} ${group.bgClass} p-5 shadow-sm transition-shadow duration-300 hover:shadow-md`}
            style={{ animationDelay: `${groupIndex * 120}ms` }}
          >
            <div className="mb-3 flex items-center gap-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${group.iconBgClass}`}>
                {group.icon}
              </div>
              <div>
                <h3 className={`font-heading text-lg font-semibold ${group.textClass}`}>
                  {group.title}
                </h3>
                <p className="text-sm text-muted-foreground">{group.subtitle}</p>
              </div>
              <span
                className={`ml-auto rounded-full ${group.badgeClass} px-2.5 py-0.5 text-xs font-semibold`}
              >
                {group.topics.length}
              </span>
            </div>

            {group.topics.length > 0 ? (
              <>
                <ul className="flex flex-col gap-2" role="list">
                  {group.topics.map((topic, topicIndex) => (
                    <li
                      key={topic.id}
                      className="flex items-center gap-3 rounded-xl bg-card/80 px-4 py-3 text-sm font-medium text-foreground shadow-sm transition-all duration-200 hover:translate-x-1 hover:shadow-md"
                      style={{ animationDelay: `${(groupIndex * 120) + (topicIndex * 60)}ms` }}
                    >
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          group.title === "Must Study Now"
                            ? "bg-red-500"
                            : group.title === "Revise If Time"
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                        }`}
                        aria-hidden="true"
                      />
                      {topic.name}
                      <span className="ml-auto text-xs text-muted-foreground">
                        confidence {topic.confidence}/5
                      </span>
                    </li>
                  ))}
                </ul>
                <p className={`mt-3 flex items-start gap-2 rounded-xl px-3 py-2 text-xs italic ${group.bgClass} ${group.textClass}`}>
                  <Heart className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                  {group.supportMessage}
                </p>
              </>
            ) : (
              <p className="py-3 text-center text-sm italic text-muted-foreground">
                {"No topics here — that's totally fine!"}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Final encouragement */}
      <div className="mt-8 animate-fade-in-up text-center" style={{ animationDelay: "400ms" }}>
        <div className="rounded-2xl border border-primary/20 bg-primary/5 px-6 py-5">
          <p className="font-heading text-base font-semibold text-foreground">
            {"You've already taken the smartest step — having a plan."}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {"Now go crush it. We believe in you."}
          </p>
        </div>
      </div>
    </section>
  )
}
