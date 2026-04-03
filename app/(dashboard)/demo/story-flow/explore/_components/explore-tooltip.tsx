"use client"

import type { Article } from "../_lib/types"

type ExploreTooltipProps = {
  article: Article
  x: number
  y: number
}

export function ExploreTooltip({ article, x, y }: ExploreTooltipProps) {
  const date = new Date(article.publishedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <div
      className="pointer-events-none absolute z-50 w-64 rounded-lg border border-border bg-card p-3 shadow-lg"
      style={{ left: x + 16, top: y - 8 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">
          {date} · {article.source}
        </span>
        <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.6rem] tabular-nums text-primary">
          {article.similarityScore.toFixed(2)}
        </span>
      </div>
      <p className="mt-1.5 text-xs font-medium text-foreground">
        {article.title}
      </p>
      <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {article.summary}
      </p>
    </div>
  )
}
