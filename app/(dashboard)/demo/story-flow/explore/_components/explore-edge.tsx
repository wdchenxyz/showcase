"use client"

import { memo } from "react"
import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react"
import { PRIMARY_COLOR } from "../_lib/types"

type ExploreEdgeData = {
  score: number
  visible: boolean
}

function ExploreEdgeComponent({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as unknown as ExploreEdgeData
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: PRIMARY_COLOR,
        strokeOpacity: edgeData.visible ? edgeData.score * 0.5 : 0,
        strokeWidth: 1.5,
        transition: "stroke-opacity 300ms ease-out 200ms",
      }}
    />
  )
}

export const ExploreEdgeType = memo(ExploreEdgeComponent)
