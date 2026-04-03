"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react"
import Dagre from "@dagrejs/dagre"
import "@xyflow/react/dist/style.css"
import "./story-flow.css"

import { storyData } from "../_data/story-data"
import type { StoryNode } from "../_lib/types"
import { StoryNodeType } from "./story-node"
import { StoryEdgeType } from "./story-edge"
import { StoryTooltip } from "./story-tooltip"
import { StepperControls } from "./stepper-controls"

// Group nodes by date for animation steps
function buildSteps(data: StoryNode[]): StoryNode[][] {
  const dateMap = new Map<string, StoryNode[]>()
  for (const node of data) {
    const group = dateMap.get(node.date) ?? []
    group.push(node)
    dateMap.set(node.date, group)
  }
  return Array.from(dateMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, nodes]) => nodes)
}

// Dagre layout
function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 80 })

  for (const node of nodes) {
    g.setNode(node.id, { width: 36, height: 36 })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  Dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return { ...node, position: { x: pos.x - 18, y: pos.y - 18 } }
  })

  return { nodes: layoutedNodes, edges }
}

const nodeTypes = { story: StoryNodeType }
const edgeTypes = { story: StoryEdgeType }

function StoryFlowInner() {
  const { fitView } = useReactFlow()
  const steps = useMemo(() => buildSteps(storyData), [])
  const totalSteps = steps.length

  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<{
    node: StoryNode
    x: number
    y: number
  } | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Compute visible node IDs from steps 0..currentStep
  const visibleIds = useMemo(() => {
    const ids = new Set<string>()
    for (let i = 0; i <= currentStep; i++) {
      for (const node of steps[i]) {
        ids.add(node.id)
      }
    }
    return ids
  }, [currentStep, steps])

  // Build React Flow nodes and edges from story data
  const { nodes, edges } = useMemo(() => {
    const rfNodes: Node[] = storyData.map((node) => ({
      id: node.id,
      type: "story",
      position: { x: 0, y: 0 },
      data: { ...node, visible: visibleIds.has(node.id) },
    }))

    const rfEdges: Edge[] = storyData
      .filter((node) => node.parentId !== null)
      .map((node) => ({
        id: `${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        type: "story",
        data: {
          category: node.category,
          visible: visibleIds.has(node.id),
        },
      }))

    return getLayoutedElements(rfNodes, rfEdges)
  }, [visibleIds])

  // Fit view when step changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fitView({ padding: 0.3, duration: 300 })
    }, 250)
    return () => clearTimeout(timer)
  }, [currentStep, fitView])

  // Auto-play interval
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 1200)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, totalSteps])

  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }, [totalSteps])

  const handleStepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCurrentStep(0)
  }, [])

  const handleNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const storyNode = storyData.find((n) => n.id === node.id)
      if (storyNode && visibleIds.has(node.id) && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setHoveredNode({
          node: storyNode,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    },
    [visibleIds]
  )

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredNode(null)
  }, [])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground">
            The AI Regulation Saga
          </h1>
          <p className="text-xs text-muted-foreground">
            Global AI policy evolution — 2023 to 2025
          </p>
        </div>
        <StepperControls
          currentStep={currentStep}
          totalSteps={totalSteps}
          isPlaying={isPlaying}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onTogglePlay={handleTogglePlay}
          onReset={handleReset}
        />
      </div>

      {/* Canvas */}
      <div ref={wrapperRef} className="relative flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          fitView
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          className="!bg-background"
        />
        {hoveredNode && (
          <StoryTooltip
            node={hoveredNode.node}
            x={hoveredNode.x}
            y={hoveredNode.y}
          />
        )}
      </div>
    </div>
  )
}

export function StoryFlow() {
  return (
    <ReactFlowProvider>
      <StoryFlowInner />
    </ReactFlowProvider>
  )
}
