# Story Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an animated branching timeline visualization page at `/demo/story-flow` that shows "The AI Regulation Saga" as a top-down flowchart with stepper controls.

**Architecture:** React Flow canvas with dagre for tree layout, custom node/edge components styled to match existing shadcn aesthetics. Static story data (~28 nodes) revealed progressively via stepper controls. Compact icon nodes with hover tooltips.

**Tech Stack:** React Flow (`@xyflow/react`), dagre, Hugeicons, shadcn/ui Button, Tailwind CSS v4, existing oklch theme tokens.

---

## File Structure

```
app/(dashboard)/demo/story-flow/
  page.tsx                    # Server component: metadata + imports StoryFlow
  _lib/
    types.ts                  # StoryNode, Category types + category color config
  _data/
    story-data.ts             # Static array of ~28 StoryNode objects
  _components/
    story-flow.tsx            # "use client" — main component: React Flow canvas + header + controls
    story-node.tsx            # Custom React Flow node: compact icon square
    story-edge.tsx            # Custom React Flow edge: animated bezier with stroke-dashoffset
    story-tooltip.tsx         # Hover tooltip: positioned card with headline/desc/date
    stepper-controls.tsx      # Play/pause/prev/next/reset buttons + step counter
```

**Also modified:**
- `app/(dashboard)/layout.tsx` — add sidebar nav link
- `app/(marketing)/page.tsx` — add homepage grid link

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install React Flow and dagre**

```bash
pnpm add @xyflow/react @dagrejs/dagre
```

- [ ] **Step 2: Verify installation**

```bash
pnpm ls @xyflow/react @dagrejs/dagre
```

Expected: both packages listed with versions.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add @xyflow/react and @dagrejs/dagre dependencies"
```

---

### Task 2: Types and category config

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_lib/types.ts`

- [ ] **Step 1: Create types file**

```typescript
export type Category = "policy" | "industry" | "opensource" | "legal" | "social"

export type StoryNode = {
  id: string
  parentId: string | null
  headline: string
  description: string
  date: string // "YYYY-MM" format
  category: Category
  icon: string // Hugeicons icon name
}

export const CATEGORY_COLORS: Record<
  Category,
  { bg: string; border: string; text: string }
> = {
  policy: {
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
  },
  industry: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
  },
  opensource: {
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    text: "text-green-400",
  },
  legal: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
  },
  social: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
  },
}

export const CATEGORY_HEX: Record<Category, string> = {
  policy: "#6366f1",
  industry: "#3b82f6",
  opensource: "#22c55e",
  legal: "#f59e0b",
  social: "#f43f5e",
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_lib/types.ts
git commit -m "feat(story-flow): add types and category color config"
```

---

### Task 3: Static story data

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_data/story-data.ts`

- [ ] **Step 1: Create the story data file**

```typescript
import type { StoryNode } from "../_lib/types"

export const storyData: StoryNode[] = [
  // Root
  {
    id: "root",
    parentId: null,
    headline: "The AI Regulation Race Begins",
    description:
      "G7 Hiroshima AI Process kickstarts global coordination on AI governance, setting the stage for divergent national approaches.",
    date: "2023-06",
    category: "policy",
    icon: "Government",
  },

  // === Branch 1: EU Policy ===
  {
    id: "eu-ai-act-draft",
    parentId: "root",
    headline: "EU AI Act Draft Advances",
    description:
      "European Parliament committees reach agreement on the world's first comprehensive AI regulation framework.",
    date: "2023-06",
    category: "policy",
    icon: "File01",
  },
  {
    id: "eu-parliament-debate",
    parentId: "eu-ai-act-draft",
    headline: "Parliamentary Debates Intensify",
    description:
      "MEPs clash over biometric surveillance bans and foundation model obligations in heated plenary sessions.",
    date: "2023-09",
    category: "policy",
    icon: "Comment01",
  },
  {
    id: "eu-ai-act-passed",
    parentId: "eu-parliament-debate",
    headline: "EU AI Act Passes",
    description:
      "European Parliament approves the AI Act with overwhelming majority, creating the world's first binding AI law.",
    date: "2024-03",
    category: "policy",
    icon: "Tick02",
  },
  {
    id: "eu-implementation",
    parentId: "eu-ai-act-passed",
    headline: "Implementation Timeline Set",
    description:
      "EU publishes phased rollout: banned practices in 6 months, high-risk rules in 24 months.",
    date: "2024-06",
    category: "policy",
    icon: "Calendar03",
  },
  {
    id: "eu-fines",
    parentId: "eu-implementation",
    headline: "First Enforcement Actions",
    description:
      "EU AI Office issues initial fines for non-compliant emotion recognition systems in hiring.",
    date: "2025-03",
    category: "legal",
    icon: "Alert02",
  },
  {
    id: "eu-compliance",
    parentId: "eu-implementation",
    headline: "Compliance Guidance Published",
    description:
      "European Commission releases detailed technical standards and compliance checklists for high-risk AI systems.",
    date: "2025-01",
    category: "policy",
    icon: "BookOpen01",
  },

  // === Branch 2: US Policy ===
  {
    id: "us-executive-order",
    parentId: "root",
    headline: "Biden Signs AI Executive Order",
    description:
      "Sweeping executive order mandates safety testing, red-teaming, and reporting requirements for powerful AI models.",
    date: "2023-10",
    category: "policy",
    icon: "PencilEdit01",
  },
  {
    id: "nist-guidelines",
    parentId: "us-executive-order",
    headline: "NIST AI Safety Guidelines",
    description:
      "National Institute of Standards and Technology publishes AI Risk Management Framework companion document.",
    date: "2024-01",
    category: "policy",
    icon: "Shield01",
  },
  {
    id: "senate-hearings",
    parentId: "us-executive-order",
    headline: "Senate AI Hearings",
    description:
      "Sam Altman, Dario Amodei, and other tech leaders testify before Congress on AI risks and regulation needs.",
    date: "2023-09",
    category: "policy",
    icon: "Building06",
  },
  {
    id: "california-sb1047",
    parentId: "senate-hearings",
    headline: "California SB 1047 Debate",
    description:
      "Controversial state bill proposes liability for AI developers; fierce lobbying from tech industry leads to veto.",
    date: "2024-08",
    category: "policy",
    icon: "Location01",
  },
  {
    id: "us-framework-debate",
    parentId: "nist-guidelines",
    headline: "Federal Framework Stalls",
    description:
      "Bipartisan AI legislation efforts fragment as Congress debates voluntary vs. mandatory approaches.",
    date: "2024-12",
    category: "policy",
    icon: "Loading03",
  },

  // === Branch 3: Industry Response ===
  {
    id: "openai-board-crisis",
    parentId: "root",
    headline: "OpenAI Board Crisis",
    description:
      "Sam Altman fired and reinstated within days, exposing tensions between safety research and commercial pressures.",
    date: "2023-11",
    category: "industry",
    icon: "Alert02",
  },
  {
    id: "frontier-model-forum",
    parentId: "openai-board-crisis",
    headline: "Frontier Model Forum Launches",
    description:
      "Google, Microsoft, OpenAI, and Anthropic form industry body for responsible AI development and safety research.",
    date: "2023-07",
    category: "industry",
    icon: "UserGroup",
  },
  {
    id: "voluntary-commitments",
    parentId: "frontier-model-forum",
    headline: "Voluntary Safety Commitments",
    description:
      "15 AI companies sign White House voluntary commitments on watermarking, red-teaming, and information sharing.",
    date: "2023-09",
    category: "industry",
    icon: "Agreement02",
  },
  {
    id: "gemini-launch",
    parentId: "openai-board-crisis",
    headline: "Google Gemini Launch",
    description:
      "Google releases Gemini multimodal model, intensifying the AI capability race amid safety concerns.",
    date: "2023-12",
    category: "industry",
    icon: "AiChat02",
  },
  {
    id: "safety-departures",
    parentId: "gemini-launch",
    headline: "Safety Team Departures",
    description:
      "Key safety researchers leave major AI labs citing commercialization pressure overriding safety priorities.",
    date: "2024-05",
    category: "social",
    icon: "UserRemove01",
  },
  {
    id: "industry-lobbying",
    parentId: "voluntary-commitments",
    headline: "Industry Lobbying Intensifies",
    description:
      "AI companies spend record amounts lobbying against mandatory regulation, pushing self-governance alternatives.",
    date: "2024-06",
    category: "industry",
    icon: "Money01",
  },

  // === Branch 4: Open Source Movement ===
  {
    id: "llama2-release",
    parentId: "root",
    headline: "Meta Releases Llama 2",
    description:
      "Meta open-sources Llama 2 family of models, sparking debate on open vs. closed AI development.",
    date: "2023-07",
    category: "opensource",
    icon: "CodeCircle",
  },
  {
    id: "mistral-funding",
    parentId: "llama2-release",
    headline: "Mistral AI Raises €400M",
    description:
      "French open-source AI startup raises massive funding round, challenging US dominance in foundation models.",
    date: "2023-12",
    category: "opensource",
    icon: "Money01",
  },
  {
    id: "huggingface-growth",
    parentId: "llama2-release",
    headline: "Hugging Face Ecosystem Explodes",
    description:
      "Open model hub surpasses 500K models, becoming the GitHub of machine learning with community-driven safety tools.",
    date: "2024-03",
    category: "opensource",
    icon: "Share01",
  },
  {
    id: "opensource-safety-debate",
    parentId: "huggingface-growth",
    headline: "Open Source Safety Debate",
    description:
      "Researchers disagree on whether open-weight models enable or undermine AI safety through transparency.",
    date: "2024-07",
    category: "opensource",
    icon: "Comment01",
  },
  {
    id: "model-weight-controversy",
    parentId: "opensource-safety-debate",
    headline: "Weight Sharing Controversy",
    description:
      "Calls for restricting model weight distribution clash with open science advocates, EU considers exemptions.",
    date: "2024-11",
    category: "opensource",
    icon: "Lock",
  },

  // === Branch 5: Legal & Social ===
  {
    id: "nyt-lawsuit",
    parentId: "root",
    headline: "NYT Sues OpenAI",
    description:
      "New York Times files landmark copyright lawsuit against OpenAI and Microsoft over training data usage.",
    date: "2023-12",
    category: "legal",
    icon: "LegalDocument01",
  },
  {
    id: "artist-copyright",
    parentId: "nyt-lawsuit",
    headline: "Artist Copyright Cases Mount",
    description:
      "Class-action lawsuits from visual artists against Stability AI and Midjourney proceed through courts.",
    date: "2024-02",
    category: "legal",
    icon: "PaintBoard",
  },
  {
    id: "deepfake-legislation",
    parentId: "nyt-lawsuit",
    headline: "Deepfake Legislation Wave",
    description:
      "Multiple US states pass laws criminalizing non-consensual AI-generated intimate imagery and election deepfakes.",
    date: "2024-06",
    category: "social",
    icon: "Image01",
  },
  {
    id: "job-displacement",
    parentId: "deepfake-legislation",
    headline: "Job Displacement Studies",
    description:
      "IMF and World Bank publish analyses showing AI could affect 40% of global jobs, amplifying inequality.",
    date: "2024-09",
    category: "social",
    icon: "ChartLineData01",
  },
]
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_data/story-data.ts
git commit -m "feat(story-flow): add AI Regulation Saga story data (28 nodes)"
```

---

### Task 4: Custom node component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_components/story-node.tsx`

- [ ] **Step 1: Create the custom node component**

This component renders a compact icon square with category coloring. It receives the `StoryNode` data via React Flow's `data` prop.

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/story-node.tsx
git commit -m "feat(story-flow): add custom React Flow node component"
```

---

### Task 5: Custom animated edge component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_components/story-edge.tsx`

- [ ] **Step 1: Create the animated edge component**

Uses SVG `stroke-dashoffset` to animate the edge drawing in. The `data.visible` flag controls animation state.

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/story-edge.tsx
git commit -m "feat(story-flow): add custom animated edge component"
```

---

### Task 6: Hover tooltip component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_components/story-tooltip.tsx`

- [ ] **Step 1: Create the tooltip component**

Positioned absolutely relative to the React Flow wrapper. Receives node data and screen coordinates.

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/story-tooltip.tsx
git commit -m "feat(story-flow): add hover tooltip component"
```

---

### Task 7: Stepper controls component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_components/stepper-controls.tsx`

- [ ] **Step 1: Create the stepper controls**

Uses shadcn `Button` with `ghost` variant and `icon-sm` size. Receives step state and callbacks.

```tsx
"use client"

import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlayIcon,
  PauseIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons"

type StepperControlsProps = {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  onStepForward: () => void
  onStepBackward: () => void
  onTogglePlay: () => void
  onReset: () => void
}

export function StepperControls({
  currentStep,
  totalSteps,
  isPlaying,
  onStepForward,
  onStepBackward,
  onTogglePlay,
  onReset,
}: StepperControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onStepBackward}
        disabled={currentStep <= 0}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={onTogglePlay}>
        <HugeiconsIcon
          icon={isPlaying ? PauseIcon : PlayIcon}
          className="size-3.5"
        />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={onStepForward}
        disabled={currentStep >= totalSteps - 1}
      >
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
      </Button>
      <span className="min-w-12 text-center text-xs tabular-nums text-muted-foreground">
        {currentStep + 1} / {totalSteps}
      </span>
      <Button variant="ghost" size="icon-sm" onClick={onReset}>
        <HugeiconsIcon icon={RefreshIcon} className="size-3.5" />
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/stepper-controls.tsx
git commit -m "feat(story-flow): add stepper controls component"
```

---

### Task 8: Main story flow component

**Files:**
- Create: `app/(dashboard)/demo/story-flow/_components/story-flow.tsx`

This is the main client component that wires everything together: dagre layout, React Flow canvas, animation state, hover tooltip, and stepper controls.

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
import Dagre from "@dagrejs/dagre"
import "@xyflow/react/dist/style.css"

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

  const wrapperRef = useRef<HTMLDivElement>(null)

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
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/story-flow.tsx
git commit -m "feat(story-flow): add main flow component with canvas, layout, and animation"
```

---

### Task 9: Page route and metadata

**Files:**
- Create: `app/(dashboard)/demo/story-flow/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
import type { Metadata } from "next"
import { StoryFlow } from "./_components/story-flow"

export const metadata: Metadata = {
  title: "Story Flow",
  description:
    "An animated branching timeline showing how the AI regulation story evolved across policy, industry, and society.",
}

export default function StoryFlowPage() {
  return (
    <div className="h-screen">
      <StoryFlow />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/page.tsx
git commit -m "feat(story-flow): add page route with metadata"
```

---

### Task 10: Add navigation links

**Files:**
- Modify: `app/(dashboard)/layout.tsx` (add sidebar link after "Json Render")
- Modify: `app/(marketing)/page.tsx` (add homepage grid link)

- [ ] **Step 1: Add sidebar link**

In `app/(dashboard)/layout.tsx`, add after the "Json Render" `<Link>`:

```tsx
<Link
  href="/demo/story-flow"
  className="block rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
>
  Story Flow
</Link>
```

- [ ] **Step 2: Add homepage link**

In `app/(marketing)/page.tsx`, add after the "Json Render" `<Link>`:

```tsx
<Link
  href="/demo/story-flow"
  className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent"
>
  Story Flow
</Link>
```

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/layout.tsx app/\(marketing\)/page.tsx
git commit -m "feat(story-flow): add navigation links to sidebar and homepage"
```

---

### Task 11: Override React Flow default styles

**Files:**
- Modify: `app/(dashboard)/demo/story-flow/_components/story-flow.tsx`

React Flow ships its own CSS. We need to ensure the controls and canvas blend with the shadcn theme. This task adds a small CSS override block.

- [ ] **Step 1: Create a CSS file for React Flow overrides**

Create `app/(dashboard)/demo/story-flow/_components/story-flow.css`:

```css
.react-flow__controls {
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--card);
  box-shadow: none;
}

.react-flow__controls-button {
  width: 28px;
  height: 28px;
  border: none;
  border-bottom: 1px solid var(--border);
  background: transparent;
  fill: var(--muted-foreground);
}

.react-flow__controls-button:hover {
  background: var(--accent);
}

.react-flow__controls-button:last-child {
  border-bottom: none;
}
```

- [ ] **Step 2: Import the CSS in story-flow.tsx**

Add this import at the top of `story-flow.tsx`, after the `@xyflow/react/dist/style.css` import:

```tsx
import "./story-flow.css"
```

- [ ] **Step 3: Commit**

```bash
git add app/\(dashboard\)/demo/story-flow/_components/story-flow.css app/\(dashboard\)/demo/story-flow/_components/story-flow.tsx
git commit -m "feat(story-flow): override React Flow controls to match shadcn theme"
```

---

### Task 12: Verify and fix

- [ ] **Step 1: Run the dev server**

```bash
pnpm dev
```

Open `http://localhost:3000/demo/story-flow` and verify:
- Page loads with the header and empty canvas (root node visible)
- Stepper controls work (next/play/reset)
- Nodes animate in with fade+scale
- Edges draw in after nodes
- Hover tooltip appears with correct content
- Pan/zoom works
- Zoom controls match theme

- [ ] **Step 2: Run lint**

```bash
pnpm lint
```

Fix any lint errors.

- [ ] **Step 3: Run build**

```bash
pnpm build
```

Fix any type errors.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(story-flow): address lint and build issues"
```
