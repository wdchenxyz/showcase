"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { SearchList01Icon, ArrowDown01Icon } from "@hugeicons/core-free-icons"

type ExploreControlsProps = {
  currentDepth: number
  canTraceDeeper: boolean
  isTracing: boolean
  onTraceDeeper: () => void
  onNewSearch: () => void
}

export function ExploreControls({
  currentDepth,
  canTraceDeeper,
  isTracing,
  onTraceDeeper,
  onNewSearch,
}: ExploreControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs tabular-nums text-muted-foreground">
        Depth: {currentDepth}
      </span>
      <Button
        variant="default"
        size="sm"
        onClick={onTraceDeeper}
        disabled={!canTraceDeeper || isTracing}
      >
        <HugeiconsIcon icon={ArrowDown01Icon} className="size-3.5" />
        {isTracing ? "Tracing..." : "Trace Deeper"}
      </Button>
      <Button variant="ghost" size="sm" onClick={onNewSearch}>
        <HugeiconsIcon icon={SearchList01Icon} className="size-3.5" />
        New Search
      </Button>
    </div>
  )
}
