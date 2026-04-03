"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { News01Icon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import type { Article, NodeStatus } from "../_lib/types"
import { PRIMARY_COLOR } from "../_lib/types"

type ExploreNodeData = {
  article: Article
  status: NodeStatus
  visible: boolean
}

function ExploreNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as ExploreNodeData
  const score = nodeData.article.similarityScore

  const opacity = 0.3 + score * 0.7

  return (
    <>
      <Handle type="target" position={Position.Top} className="!invisible" />
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border transition-all duration-200 ease-out",
          nodeData.status === "expanded" && "ring-2 ring-primary/30",
          nodeData.visible
            ? "scale-100 opacity-100"
            : "scale-[0.8] opacity-0"
        )}
        style={{
          backgroundColor: `color-mix(in oklch, ${PRIMARY_COLOR} ${Math.round(score * 100)}%, transparent)`,
          borderColor: `color-mix(in oklch, ${PRIMARY_COLOR} ${Math.round(score * 60 + 20)}%, transparent)`,
          opacity: nodeData.status === "exhausted" ? 0.4 : opacity,
        }}
      >
        <HugeiconsIcon
          icon={News01Icon}
          className="size-4"
          style={{
            color: `color-mix(in oklch, ${PRIMARY_COLOR} ${Math.round(score * 100 + 40)}%, white)`,
          }}
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!invisible"
      />
    </>
  )
}

export const ExploreNodeType = memo(ExploreNodeComponent)
