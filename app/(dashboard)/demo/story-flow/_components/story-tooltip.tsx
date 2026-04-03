"use client"

import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, type StoryNode, type Category } from "../_lib/types"

const CATEGORY_LABELS: Record<Category, string> = {
  policy: "Policy",
  industry: "Industry",
  opensource: "Open Source",
  legal: "Legal",
  social: "Social",
}

type StoryTooltipProps = {
  node: StoryNode
  x: number
  y: number
}

export function StoryTooltip({ node, x, y }: StoryTooltipProps) {
  const colors = CATEGORY_COLORS[node.category]

  return (
    <div
      className="pointer-events-none absolute z-50 w-56 rounded-lg border border-border bg-card p-3 shadow-lg"
      style={{ left: x + 16, top: y - 8 }}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[0.625rem] uppercase tracking-wider text-muted-foreground">
          {node.date}
        </span>
        <span className="text-muted-foreground">·</span>
        <span
          className={cn(
            "text-[0.625rem] uppercase tracking-wider",
            colors.text
          )}
        >
          {CATEGORY_LABELS[node.category]}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium text-foreground">
        {node.headline}
      </p>
      <p className="mt-1 text-[0.6875rem] leading-relaxed text-muted-foreground">
        {node.description}
      </p>
    </div>
  )
}
