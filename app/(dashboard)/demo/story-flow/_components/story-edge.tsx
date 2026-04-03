"use client"

import { memo } from "react"
import {
  BaseEdge,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react"
import { CATEGORY_HEX, type Category } from "../_lib/types"

type StoryEdgeData = {
  category: Category
  visible: boolean
}

function StoryEdgeComponent({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps) {
  const edgeData = data as unknown as StoryEdgeData
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const color = CATEGORY_HEX[edgeData.category]

  return (
    <BaseEdge
      path={edgePath}
      style={{
        stroke: color,
        strokeOpacity: edgeData.visible ? 0.4 : 0,
        strokeWidth: 1.5,
        transition: "stroke-opacity 300ms ease-out 200ms",
      }}
    />
  )
}

export const StoryEdgeType = memo(StoryEdgeComponent)
