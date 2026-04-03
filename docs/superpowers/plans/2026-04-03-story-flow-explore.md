# Story Flow Explorer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dynamic topic archaeology page at `/demo/story-flow/explore` where users search a topic, see seed articles, and progressively trace back through time to build a branching tree of related news.

**Architecture:** Client-side React Flow canvas with a service adapter pattern. A `useStoryFlow` hook wraps a React reducer that manages tree state (nodes, edges, phase). Mock service provides fake "Trump Tariffs" data with simulated delays. Users click "Trace Deeper" to expand the tree level by level, stopping when similarity scores drop below threshold.

**Tech Stack:** React Flow + dagre (already installed), shadcn/ui Input + Button, adapter pattern with mock service.

---

## File Structure

```
app/(dashboard)/demo/story-flow/explore/
  page.tsx                          # Server component: metadata + imports ExploreFlow
  _lib/
    types.ts                        # Article, TreeNode, TreeState, StoryFlowService types
    reducer.ts                      # Tree state reducer
    use-story-flow.ts               # Hook: wraps reducer + service calls
    layout.ts                       # Dagre layout function
  _services/
    service.ts                      # StoryFlowService interface + default export
    mock-service.ts                 # Mock implementation with fake data
  _components/
    explore-flow.tsx                # "use client" — main component
    explore-node.tsx                # Custom React Flow node: score-colored circle
    explore-edge.tsx                # Custom React Flow edge: score-based opacity
    explore-tooltip.tsx             # Hover tooltip: article details
    explore-controls.tsx            # "Trace Deeper" + depth + "New Search"
    search-input.tsx                # Centered search input for idle state
```

**Also modified:**
- `app/(dashboard)/layout.tsx` — add sidebar nav link
- `app/(marketing)/page.tsx` — add homepage grid link

---

### Task 1: Types and service interface

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_lib/types.ts`
- Create: `app/(dashboard)/demo/story-flow/explore/_services/service.ts`

- [ ] **Step 1: Create types file**

```typescript
export type Article = {
  id: string
  title: string
  summary: string
  publishedDate: string
  url: string
  source: string
  similarityScore: number
}

export type NodeStatus = "leaf" | "expanded" | "exhausted"

export type TreeNode = {
  article: Article
  parentIds: string[]
  depth: number
  status: NodeStatus
}

export type Phase = "idle" | "searching" | "tracing" | "ready"

export type TreeState = {
  nodes: Map<string, TreeNode>
  query: string
  phase: Phase
  currentDepth: number
}

export type TreeAction =
  | { type: "SEARCH_START"; query: string }
  | { type: "SEARCH_COMPLETE"; articles: Article[] }
  | { type: "TRACE_START" }
  | { type: "TRACE_COMPLETE"; parentId: string; articles: Article[] }
  | { type: "TRACE_BATCH_DONE" }
  | { type: "RESET" }

export const SIMILARITY_THRESHOLD = 0.4

export const PRIMARY_COLOR = "#6366f1"
```

- [ ] **Step 2: Create service interface file**

```typescript
import type { Article } from "../_lib/types"

export interface StoryFlowService {
  searchArticles(query: string): Promise<Article[]>
  traceBack(articleId: string): Promise<Article[]>
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_lib/types.ts app/\(dashboard\)/demo/story-flow/explore/_services/service.ts
git commit -m "feat(explore): add types and service interface"
```

---

### Task 2: Mock service

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_services/mock-service.ts`

- [ ] **Step 1: Create the mock service**

```typescript
import type { Article } from "../_lib/types"
import type { StoryFlowService } from "./service"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

const SEED_ARTICLES: Article[] = [
  {
    id: "seed-1",
    title: "US Announces New Tariff Package on Chinese Imports",
    summary:
      "The White House unveiled a sweeping set of tariffs targeting $200B in Chinese goods, marking a major escalation in the trade war.",
    publishedDate: "2025-03-15",
    url: "https://example.com/tariff-package",
    source: "Reuters",
    similarityScore: 0.92,
  },
  {
    id: "seed-2",
    title: "EU Responds to Trump Trade Threats with Retaliatory Measures",
    summary:
      "European Commission announces counter-tariffs on American agricultural products and tech services in response to US trade policy.",
    publishedDate: "2025-03-10",
    url: "https://example.com/eu-response",
    source: "Financial Times",
    similarityScore: 0.88,
  },
  {
    id: "seed-3",
    title: "Asian Markets Tumble as Trade War Fears Intensify",
    summary:
      "Major Asian stock indices fell sharply as investors reacted to escalating tariff threats between the US and its trading partners.",
    publishedDate: "2025-03-12",
    url: "https://example.com/asian-markets",
    source: "Bloomberg",
    similarityScore: 0.85,
  },
  {
    id: "seed-4",
    title: "US Auto Industry Warns of Price Hikes from Tariffs",
    summary:
      "Detroit automakers warn that new tariffs on imported parts could raise vehicle prices by up to $5,000 per car.",
    publishedDate: "2025-03-08",
    url: "https://example.com/auto-tariffs",
    source: "Wall Street Journal",
    similarityScore: 0.79,
  },
  {
    id: "seed-5",
    title: "Canada Announces Tariff Retaliation Strategy",
    summary:
      "Canadian government outlines retaliatory tariff plan targeting US steel, aluminum, and agricultural products.",
    publishedDate: "2025-03-14",
    url: "https://example.com/canada-retaliation",
    source: "Globe and Mail",
    similarityScore: 0.82,
  },
]

const TRACEBACK_DATA: Record<string, Article[]> = {
  "seed-1": [
    {
      id: "tb-1a",
      title: "White House Signals Tougher Stance on China Trade",
      summary:
        "Senior officials hint at new tariff measures as trade talks stall, citing national security concerns.",
      publishedDate: "2025-02-20",
      url: "https://example.com/tough-stance",
      source: "Washington Post",
      similarityScore: 0.78,
    },
    {
      id: "tb-1b",
      title: "US-China Trade Talks Break Down Over Tech Transfer",
      summary:
        "Negotiations collapse as Beijing refuses to concede on forced technology transfer practices.",
      publishedDate: "2025-02-10",
      url: "https://example.com/talks-breakdown",
      source: "Reuters",
      similarityScore: 0.72,
    },
  ],
  "seed-2": [
    {
      id: "tb-2a",
      title: "EU Trade Commissioner Warns of Retaliation",
      summary:
        "Commissioner Dombrovskis says Europe will not hesitate to defend its economic interests against unilateral tariffs.",
      publishedDate: "2025-02-25",
      url: "https://example.com/eu-warning",
      source: "Politico",
      similarityScore: 0.75,
    },
    {
      id: "tb-shared-1",
      title: "WTO Rules US Steel Tariffs Violate Trade Agreements",
      summary:
        "World Trade Organization panel finds US Section 232 tariffs on steel and aluminum breach international trade law.",
      publishedDate: "2025-01-15",
      url: "https://example.com/wto-ruling",
      source: "Financial Times",
      similarityScore: 0.68,
    },
  ],
  "seed-3": [
    {
      id: "tb-3a",
      title: "Global Supply Chains Brace for Tariff Impact",
      summary:
        "Multinational companies accelerate supply chain diversification as trade tensions threaten established routes.",
      publishedDate: "2025-02-18",
      url: "https://example.com/supply-chains",
      source: "Bloomberg",
      similarityScore: 0.7,
    },
  ],
  "seed-4": [
    {
      id: "tb-4a",
      title: "Auto Parts Tariff Proposal Draws Industry Backlash",
      summary:
        "Major manufacturers lobby against proposed tariffs on imported auto components, warning of job losses.",
      publishedDate: "2025-02-05",
      url: "https://example.com/auto-lobby",
      source: "Detroit Free Press",
      similarityScore: 0.65,
    },
    {
      id: "tb-shared-1",
      title: "WTO Rules US Steel Tariffs Violate Trade Agreements",
      summary:
        "World Trade Organization panel finds US Section 232 tariffs on steel and aluminum breach international trade law.",
      publishedDate: "2025-01-15",
      url: "https://example.com/wto-ruling",
      source: "Financial Times",
      similarityScore: 0.62,
    },
  ],
  "seed-5": [
    {
      id: "tb-5a",
      title: "USMCA Under Strain as Trade Tensions Rise",
      summary:
        "The US-Mexico-Canada trade agreement faces its biggest test as tariff threats undermine trilateral cooperation.",
      publishedDate: "2025-02-22",
      url: "https://example.com/usmca-strain",
      source: "Globe and Mail",
      similarityScore: 0.73,
    },
  ],
  // Depth 2 trace-backs
  "tb-1a": [
    {
      id: "tb-d2-1",
      title: "Trump Campaign Pledges Aggressive Trade Policy",
      summary:
        "Presidential campaign rhetoric signals a return to protectionist trade measures if elected.",
      publishedDate: "2024-12-10",
      url: "https://example.com/campaign-trade",
      source: "Politico",
      similarityScore: 0.55,
    },
  ],
  "tb-1b": [
    {
      id: "tb-d2-2",
      title: "US-China Phase One Deal Falls Short of Goals",
      summary:
        "Analysis shows China failed to meet purchasing commitments under the 2020 trade agreement.",
      publishedDate: "2024-11-20",
      url: "https://example.com/phase-one",
      source: "CNBC",
      similarityScore: 0.48,
    },
  ],
  "tb-2a": [
    {
      id: "tb-d2-3",
      title: "Transatlantic Trade Relations at Historic Low",
      summary:
        "EU-US trade disputes multiply across tech regulation, agriculture, and industrial subsidies.",
      publishedDate: "2024-12-05",
      url: "https://example.com/transatlantic",
      source: "Financial Times",
      similarityScore: 0.52,
    },
  ],
  "tb-shared-1": [
    {
      id: "tb-d2-4",
      title: "Section 232 Tariffs: A History of Controversy",
      summary:
        "How national security justifications for trade barriers became a flashpoint in global commerce.",
      publishedDate: "2024-10-15",
      url: "https://example.com/section-232",
      source: "The Economist",
      similarityScore: 0.45,
    },
  ],
  "tb-3a": [
    {
      id: "tb-d2-5",
      title: "Vietnam Emerges as Alternative Manufacturing Hub",
      summary:
        "Southeast Asian nations benefit as companies shift production away from China amid trade uncertainty.",
      publishedDate: "2024-11-30",
      url: "https://example.com/vietnam-hub",
      source: "Nikkei Asia",
      similarityScore: 0.42,
    },
  ],
  "tb-4a": [
    {
      id: "tb-d2-6",
      title: "US Manufacturing Output Declines Despite Tariff Protection",
      summary:
        "Economic data shows tariffs failed to revive domestic manufacturing, contradicting policy goals.",
      publishedDate: "2024-11-10",
      url: "https://example.com/manufacturing-decline",
      source: "Wall Street Journal",
      similarityScore: 0.38,
    },
  ],
  "tb-5a": [
    {
      id: "tb-d2-7",
      title: "Canada-US Lumber Dispute Enters New Phase",
      summary:
        "Long-running softwood lumber trade dispute escalates with new duties imposed on Canadian imports.",
      publishedDate: "2024-12-18",
      url: "https://example.com/lumber-dispute",
      source: "CBC News",
      similarityScore: 0.35,
    },
  ],
  // Depth 3 — all below threshold
  "tb-d2-1": [
    {
      id: "tb-d3-1",
      title: "Historical Analysis: Smoot-Hawley and Modern Protectionism",
      summary:
        "Economists draw parallels between 1930s trade policy and current protectionist trends.",
      publishedDate: "2024-08-20",
      url: "https://example.com/smoot-hawley",
      source: "The Atlantic",
      similarityScore: 0.28,
    },
  ],
  "tb-d2-2": [
    {
      id: "tb-d3-2",
      title: "Global Trade Volume Trends: A Decade in Review",
      summary:
        "Trade growth has slowed significantly since 2018, with tariff wars cited as a primary factor.",
      publishedDate: "2024-09-05",
      url: "https://example.com/trade-trends",
      source: "World Bank",
      similarityScore: 0.25,
    },
  ],
}

export class MockStoryFlowService implements StoryFlowService {
  async searchArticles(_query: string): Promise<Article[]> {
    await delay(500)
    return [...SEED_ARTICLES]
  }

  async traceBack(articleId: string): Promise<Article[]> {
    await delay(300)
    return [...(TRACEBACK_DATA[articleId] ?? [])]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_services/mock-service.ts
git commit -m "feat(explore): add mock service with Trump Tariffs data"
```

---

### Task 3: Tree state reducer

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_lib/reducer.ts`

- [ ] **Step 1: Create the reducer**

```typescript
import type { TreeState, TreeAction, TreeNode, Article } from "./types"
import { SIMILARITY_THRESHOLD } from "./types"

export const initialState: TreeState = {
  nodes: new Map(),
  query: "",
  phase: "idle",
  currentDepth: 0,
}

export function treeReducer(state: TreeState, action: TreeAction): TreeState {
  switch (action.type) {
    case "SEARCH_START":
      return {
        ...initialState,
        query: action.query,
        phase: "searching",
      }

    case "SEARCH_COMPLETE": {
      const nodes = new Map<string, TreeNode>()
      for (const article of action.articles) {
        nodes.set(article.id, {
          article,
          parentIds: [],
          depth: 0,
          status: "leaf",
        })
      }
      return { ...state, nodes, phase: "ready", currentDepth: 0 }
    }

    case "TRACE_START":
      return { ...state, phase: "tracing" }

    case "TRACE_COMPLETE": {
      const nodes = new Map(state.nodes)
      const parentNode = nodes.get(action.parentId)
      if (!parentNode) return state

      const hasHighScoreChild = action.articles.some(
        (a) => a.similarityScore >= SIMILARITY_THRESHOLD
      )

      // Update parent status
      nodes.set(action.parentId, {
        ...parentNode,
        status: hasHighScoreChild ? "expanded" : "exhausted",
      })

      // Add or merge child articles
      for (const article of action.articles) {
        const existing = nodes.get(article.id)
        if (existing) {
          // Convergence: add parent ID to existing node
          if (!existing.parentIds.includes(action.parentId)) {
            nodes.set(article.id, {
              ...existing,
              parentIds: [...existing.parentIds, action.parentId],
            })
          }
        } else {
          nodes.set(article.id, {
            article,
            parentIds: [action.parentId],
            depth: parentNode.depth + 1,
            status: "leaf",
          })
        }
      }

      return { ...state, nodes }
    }

    case "TRACE_BATCH_DONE":
      return {
        ...state,
        phase: "ready",
        currentDepth: state.currentDepth + 1,
      }

    case "RESET":
      return { ...initialState }

    default:
      return state
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_lib/reducer.ts
git commit -m "feat(explore): add tree state reducer with deduplication"
```

---

### Task 4: useStoryFlow hook

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_lib/use-story-flow.ts`

- [ ] **Step 1: Create the hook**

```typescript
"use client"

import { useCallback, useMemo, useReducer } from "react"
import type { StoryFlowService } from "../_services/service"
import type { Article } from "./types"
import { SIMILARITY_THRESHOLD } from "./types"
import { treeReducer, initialState } from "./reducer"

export function useStoryFlow(service: StoryFlowService) {
  const [state, dispatch] = useReducer(treeReducer, initialState)

  const search = useCallback(
    async (query: string) => {
      dispatch({ type: "SEARCH_START", query })
      const articles = await service.searchArticles(query)
      dispatch({ type: "SEARCH_COMPLETE", articles })
    },
    [service]
  )

  const traceDeeper = useCallback(async () => {
    // Find leaf nodes above threshold
    const leaves: string[] = []
    for (const [id, node] of state.nodes) {
      if (
        node.status === "leaf" &&
        node.article.similarityScore >= SIMILARITY_THRESHOLD
      ) {
        leaves.push(id)
      }
    }
    if (leaves.length === 0) return

    dispatch({ type: "TRACE_START" })

    // Trace all leaves in parallel
    const results = await Promise.all(
      leaves.map(async (id) => {
        const articles = await service.traceBack(id)
        return { parentId: id, articles }
      })
    )

    for (const { parentId, articles } of results) {
      dispatch({ type: "TRACE_COMPLETE", parentId, articles })
    }

    dispatch({ type: "TRACE_BATCH_DONE" })
  }, [service, state.nodes])

  const reset = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  const canTraceDeeper = useMemo(() => {
    for (const node of state.nodes.values()) {
      if (
        node.status === "leaf" &&
        node.article.similarityScore >= SIMILARITY_THRESHOLD
      ) {
        return true
      }
    }
    return false
  }, [state.nodes])

  return { state, search, traceDeeper, reset, canTraceDeeper }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_lib/use-story-flow.ts
git commit -m "feat(explore): add useStoryFlow hook"
```

---

### Task 5: Dagre layout function

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_lib/layout.ts`

- [ ] **Step 1: Create the layout function**

Duplicated from the static demo with minor adjustments (node size for circles).

```typescript
import type { Node, Edge } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 70 })

  for (const node of nodes) {
    g.setNode(node.id, { width: 34, height: 34 })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  Dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return { ...node, position: { x: pos.x - 17, y: pos.y - 17 } }
  })

  return { nodes: layoutedNodes, edges }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_lib/layout.ts
git commit -m "feat(explore): add dagre layout function"
```

---

### Task 6: Explore node component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/explore-node.tsx`

- [ ] **Step 1: Create the explore node**

A circular dot colored by similarity score. High score = vivid primary, low score = faded.

```tsx
"use client"

import { memo } from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
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

  // Map score to opacity: 0.3 at score=0, 1.0 at score=1
  const opacity = 0.3 + score * 0.7

  return (
    <>
      <Handle type="target" position={Position.Top} className="!invisible" />
      <div
        className={cn(
          "flex size-8 items-center justify-center rounded-full border transition-all duration-200 ease-out",
          nodeData.status === "expanded" && "ring-2 ring-primary/30",
          nodeData.status === "exhausted" && "opacity-40",
          nodeData.visible
            ? "scale-100 opacity-100"
            : "scale-[0.8] opacity-0"
        )}
        style={{
          backgroundColor: `color-mix(in oklch, ${PRIMARY_COLOR} ${Math.round(score * 100)}%, transparent)`,
          borderColor: `color-mix(in oklch, ${PRIMARY_COLOR} ${Math.round(score * 60 + 20)}%, transparent)`,
          opacity: nodeData.status === "exhausted" ? 0.4 : opacity,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!invisible"
      />
    </>
  )
}

export const ExploreNodeType = memo(ExploreNodeComponent)
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/explore-node.tsx
git commit -m "feat(explore): add score-colored node component"
```

---

### Task 7: Explore edge component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/explore-edge.tsx`

- [ ] **Step 1: Create the explore edge**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/explore-edge.tsx
git commit -m "feat(explore): add score-based edge component"
```

---

### Task 8: Explore tooltip component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/explore-tooltip.tsx`

- [ ] **Step 1: Create the tooltip**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/explore-tooltip.tsx
git commit -m "feat(explore): add article tooltip component"
```

---

### Task 9: Explore controls component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/explore-controls.tsx`

- [ ] **Step 1: Create the controls**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/explore-controls.tsx
git commit -m "feat(explore): add explore controls component"
```

---

### Task 10: Search input component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/search-input.tsx`

- [ ] **Step 1: Create the search input**

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

type SearchInputProps = {
  onSearch: (query: string) => void
  isSearching: boolean
}

export function SearchInput({ onSearch, isSearching }: SearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a topic to explore..."
          disabled={isSearching}
          className="h-9 text-sm"
          autoFocus
        />
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/search-input.tsx
git commit -m "feat(explore): add search input component"
```

---

### Task 11: Main explore flow component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/_components/explore-flow.tsx`

- [ ] **Step 1: Create the main component**

```tsx
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

  // Build React Flow nodes and edges from tree state
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

  // Fit view when nodes change
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

  // Idle state — show search input
  if (state.phase === "idle") {
    return <SearchInput onSearch={search} isSearching={false} />
  }

  // Searching state — show search input with loading
  if (state.phase === "searching") {
    return <SearchInput onSearch={search} isSearching={true} />
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/_components/explore-flow.tsx
git commit -m "feat(explore): add main explore flow component"
```

---

### Task 12: Page route, navigation, and metadata

**Files:**
- Create: `app/(dashboard)/demo/story-flow/explore/page.tsx`
- Modify: `app/(dashboard)/layout.tsx`
- Modify: `app/(marketing)/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
import type { Metadata } from "next"
import { ExploreFlow } from "./_components/explore-flow"

export const metadata: Metadata = {
  title: "Story Flow Explorer",
  description:
    "Explore how news stories evolve and branch over time by tracing article relationships.",
}

export default function ExploreFlowPage() {
  return (
    <div className="h-screen">
      <ExploreFlow />
    </div>
  )
}
```

- [ ] **Step 2: Add sidebar link**

In `app/(dashboard)/layout.tsx`, add after the "Story Flow" `<Link>`:

```tsx
<Link
  href="/demo/story-flow/explore"
  className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
>
  Explore
</Link>
```

- [ ] **Step 3: Add homepage link**

In `app/(marketing)/page.tsx`, add after the "Story Flow" `<Link>`:

```tsx
<Link
  href="/demo/story-flow/explore"
  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
>
  Explore
</Link>
```

- [ ] **Step 4: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/explore/page.tsx app/\(dashboard\)/layout.tsx app/\(marketing\)/page.tsx
git commit -m "feat(explore): add page route and navigation links"
```

---

### Task 13: Verify and fix

- [ ] **Step 1: Run lint**

```bash
pnpm lint
```

Fix any lint errors.

- [ ] **Step 2: Run build**

```bash
pnpm build
```

Fix any type errors.

- [ ] **Step 3: Run the dev server and test**

```bash
pnpm dev
```

Open `http://localhost:3000/demo/story-flow/explore` and verify:
- Idle state shows centered search input
- Typing "Trump Tariffs" and pressing Enter shows seed articles after 500ms
- Header shows query text and article count
- "Trace Deeper" button works — tree grows with new nodes fading in
- Depth counter increments
- Hover tooltip shows article title, summary, date, source, score
- "Trace Deeper" disables when no more high-score leaves remain
- "New Search" returns to idle state
- Pan/zoom works on the canvas
- Sidebar and homepage links work

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(explore): address lint and build issues"
```
