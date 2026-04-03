"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ReactFlow,
  useReactFlow,
  ReactFlowProvider,
  type Node,
  type Edge,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import "../../_components/story-flow.css"

import type { Article } from "../_lib/types"
import { useStoryFlow } from "../_lib/use-story-flow"
import { getLayoutedElements } from "../_lib/layout"
import { MockStoryFlowService } from "../_services/mock-service"
import { ExploreNodeType } from "./explore-node"
import { ExploreEdgeType } from "./explore-edge"
import { ExploreTooltip } from "./explore-tooltip"
import { ExploreControls } from "./explore-controls"
import { SearchInput } from "./search-input"

const service = new MockStoryFlowService()

const nodeTypes = { explore: ExploreNodeType }
const edgeTypes = { explore: ExploreEdgeType }

function ExploreFlowInner() {
  const { fitView } = useReactFlow()
  const { state, search, traceDeeper, reset, canTraceDeeper } =
    useStoryFlow(service)

  const [hoveredArticle, setHoveredArticle] = useState<{
    article: Article
    x: number
    y: number
  } | null>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const { nodes, edges } = useMemo(() => {
    if (state.nodes.size === 0) return { nodes: [], edges: [] }

    const rfNodes: Node[] = []
    const rfEdges: Edge[] = []

    for (const [id, treeNode] of state.nodes) {
      rfNodes.push({
        id,
        type: "explore",
        position: { x: 0, y: 0 },
        data: {
          article: treeNode.article,
          status: treeNode.status,
          visible: true,
        },
      })

      for (const parentId of treeNode.parentIds) {
        rfEdges.push({
          id: `${parentId}-${id}`,
          source: parentId,
          target: id,
          type: "explore",
          data: {
            score: treeNode.article.similarityScore,
            visible: true,
          },
        })
      }
    }

    return getLayoutedElements(rfNodes, rfEdges)
  }, [state.nodes])

  useEffect(() => {
    if (state.nodes.size === 0) return
    const timer = setTimeout(() => {
      fitView({ padding: 0.3, duration: 300 })
    }, 250)
    return () => clearTimeout(timer)
  }, [state.nodes, fitView])

  const handleNodeMouseEnter = useCallback(
    (event: React.MouseEvent, node: Node) => {
      const treeNode = state.nodes.get(node.id)
      if (treeNode && wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect()
        setHoveredArticle({
          article: treeNode.article,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        })
      }
    },
    [state.nodes]
  )

  const handleNodeMouseLeave = useCallback(() => {
    setHoveredArticle(null)
  }, [])

  if (state.phase === "idle") {
    return <SearchInput onSearch={search} isSearching={false} />
  }

  if (state.phase === "searching") {
    return <SearchInput onSearch={search} isSearching={true} />
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h1 className="text-sm font-semibold text-foreground">
            {state.query}
          </h1>
          <p className="text-xs text-muted-foreground">
            {state.nodes.size} articles discovered
          </p>
        </div>
        <ExploreControls
          currentDepth={state.currentDepth}
          canTraceDeeper={canTraceDeeper}
          isTracing={state.phase === "tracing"}
          onTraceDeeper={traceDeeper}
          onNewSearch={reset}
        />
      </div>

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
        {hoveredArticle && (
          <ExploreTooltip
            article={hoveredArticle.article}
            x={hoveredArticle.x}
            y={hoveredArticle.y}
          />
        )}
      </div>
    </div>
  )
}

export function ExploreFlow() {
  return (
    <ReactFlowProvider>
      <ExploreFlowInner />
    </ReactFlowProvider>
  )
}
