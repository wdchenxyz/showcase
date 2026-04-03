"use client"

import { memo } from "react"
import type { NodeProps } from "@xyflow/react"

type TimelineLabelData = {
  label: string
}

function TimelineLabelComponent({ data }: NodeProps) {
  const labelData = data as unknown as TimelineLabelData

  return (
    <div className="flex h-8 items-center pr-4 text-[0.625rem] uppercase tracking-wider text-muted-foreground">
      {labelData.label}
    </div>
  )
}

export const TimelineLabelType = memo(TimelineLabelComponent)
