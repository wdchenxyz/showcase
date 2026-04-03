"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { HugeiconsIcon } from "@hugeicons/react"
import * as icons from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import { CATEGORY_COLORS, type StoryNode } from "../_lib/types"

type StoryNodeData = StoryNode & { visible: boolean }

function StoryNodeComponent({ data }: NodeProps) {
  const nodeData = data as unknown as StoryNodeData
  const colors = CATEGORY_COLORS[nodeData.category]
  const IconComponent = (icons as Record<string, unknown>)[
    `${nodeData.icon}Icon`
  ] as icons.IconSvgElement | undefined

  return (
    <>
      <Handle type="target" position={Position.Top} className="!invisible" />
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg border transition-all duration-200 ease-out",
          colors.bg,
          colors.border,
          nodeData.visible
            ? "scale-100 opacity-100"
            : "scale-[0.8] opacity-0"
        )}
      >
        {IconComponent && (
          <HugeiconsIcon
            icon={IconComponent}
            className={cn("size-4", colors.text)}
          />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!invisible"
      />
    </>
  )
}

export const StoryNodeType = memo(StoryNodeComponent)
