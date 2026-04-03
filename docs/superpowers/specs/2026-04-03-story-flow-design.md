# Story Flow: Branching News Timeline Visualization

A showcase page that visualizes how a news story evolves and branches over time, rendered as an animated top-down flowchart.

## Demo Story: "The AI Regulation Saga"

A rich branching narrative covering global AI policy evolution from 2023 to 2025, with ~28 nodes spanning regulatory actions, industry responses, open-source movements, legal battles, and social impact.

## Page Location

- **Route**: `/demo/story-flow`
- **Layout**: nested under the existing `(dashboard)` layout with sidebar navigation
- **Navigation**: add link to homepage grid and sidebar

## Tech Stack

- **React Flow (xyflow)**: canvas rendering, pan/zoom, viewport management, custom nodes/edges
- **dagre**: automatic top-down tree layout algorithm
- **Existing**: shadcn/ui styling, Hugeicons, Tailwind CSS v4, oklch color tokens

## Page Layout

### Header Bar
- Story title ("The AI Regulation Saga") and subtitle on the left
- Stepper controls on the right:
  - Previous step button (step backward)
  - Play/Pause toggle button (auto-advance)
  - Next step button (step forward)
  - Step counter display (e.g. "12 / 28")
  - Reset button (return to initial state)
- Styled with shadcn `Button` variants (ghost/outline, icon size)

### Canvas Area
- React Flow fills remaining viewport height (`flex: 1`)
- Subtle dark background differentiated from the page chrome
- Zoom controls in bottom-right corner (+/−/fit-view)
- Pan via mouse drag, zoom via scroll

## Data Model

```typescript
type Category = "policy" | "industry" | "opensource" | "legal" | "social"

type StoryNode = {
  id: string
  parentId: string | null     // null for root node
  headline: string            // shown in hover tooltip
  description: string         // 1-2 sentences, shown in hover tooltip
  date: string                // "YYYY-MM" format, used for chronological ordering
  category: Category
  icon: string                // Hugeicons icon name
}
```

### Category Color Mapping

Each category maps to a color from the existing theme:

| Category    | Color Intent    | Usage                                    |
|-------------|-----------------|------------------------------------------|
| `policy`    | Indigo/primary  | Government regulations, executive orders |
| `industry`  | Blue            | Company actions, product launches        |
| `opensource` | Green          | Open-source releases, community efforts  |
| `legal`     | Amber           | Lawsuits, copyright rulings              |
| `social`    | Rose            | Public response, societal impact          |

Colors are defined as CSS variables to integrate with the existing oklch theme system.

## Node Rendering

### Compact Node (default state)
- Square icon container, ~36-40px
- Rounded corners (border-radius matching theme `--radius` tokens)
- Background tinted with category color at low opacity
- Border in category color at moderate opacity
- Hugeicons icon centered inside

### Node States
- **Hidden**: `opacity: 0`, `scale: 0.8` — not yet revealed in animation
- **Visible**: `opacity: 1`, `scale: 1` — revealed via animation
- **Hovered**: subtle glow/ring effect in category color

### Hover Tooltip
- Appears on `nodeMouseEnter`, disappears on `nodeMouseLeave`
- Positioned near the hovered node, rendered outside the React Flow canvas to avoid clipping
- Contents:
  - Date + category label (small, muted, uppercase)
  - Headline (medium weight)
  - Description (small, muted)
- Styled as a floating card with backdrop blur, matching shadcn card aesthetic
- Subtle shadow for depth

## Edge Rendering

- Smooth bezier curves (React Flow's `bezier` edge type)
- Color matches the child node's category color at 40% opacity
- Animate in via SVG `stroke-dashoffset` transition when the child node is revealed
- Retract (reverse animation) when stepping backward

## Animation System

### Sequence
- Nodes are sorted chronologically by `date`
- Nodes sharing the same `date` are grouped into a single step
- Each step reveals the node(s) and their connecting edge(s)

### Step Behavior
1. Node fades in + scales from 0.8 to 1.0 (200ms ease-out)
2. Connecting edge draws from parent to child via stroke-dashoffset (300ms, starts after node appears)
3. `fitView` called with padding to keep newly revealed content in viewport

### Controls
- **Step forward**: reveal next chronological group
- **Step backward**: reverse — edge retracts, then node fades out
- **Play**: auto-advance one step every 1.2 seconds; button shows pause icon while playing
- **Reset**: snap back to root-only state (no animation, instant)

### State
- Single `currentStep` index into the sorted step array
- Derived: `visibleNodeIds` = all node IDs from steps 0..currentStep
- React Flow nodes/edges filtered by visibility, with CSS transitions for reveal

## Story Data

Approximately 28 nodes organized as a tree:

**Root (2023-06)**: "The AI Regulation Race Begins" — G7 Hiroshima AI Process kickstarts global coordination

**Branch 1 — EU Policy** (~7 nodes): EU AI Act drafting, parliamentary debates, final passage, implementation timeline, compliance deadlines, enforcement agency setup

**Branch 2 — US Policy** (~6 nodes): Biden Executive Order, NIST guidelines, Senate hearings, state-level laws (California SB 1047), federal framework debates

**Branch 3 — Industry Response** (~6 nodes): OpenAI board crisis, Frontier Model Forum, voluntary commitments, Google Gemini launch, safety team departures, industry lobbying

**Branch 4 — Open Source Movement** (~5 nodes): Llama 2 open release, Mistral funding, Hugging Face growth, open-source safety debate, model weight sharing controversy

**Branch 5 — Legal & Social** (~4 nodes): NYT v OpenAI lawsuit, artist copyright cases, deepfake legislation, job displacement studies

Some branches have sub-branches (e.g., EU enforcement splits into "fines issued" and "compliance guidance"). A few later nodes reference events from multiple branches (shown as separate nodes, not merged edges, to keep the tree structure clean).

## File Structure

```
app/(dashboard)/demo/story-flow/
  page.tsx                    # page component, metadata
  _components/
    story-flow.tsx            # main client component (canvas + controls)
    story-node.tsx            # custom React Flow node component
    story-edge.tsx            # custom React Flow edge component (animated)
    story-tooltip.tsx         # hover tooltip component
    stepper-controls.tsx      # play/pause/prev/next/reset controls
  _data/
    story-data.ts             # static node array for "AI Regulation Saga"
  _lib/
    layout.ts                 # dagre layout configuration
    types.ts                  # StoryNode type, Category type
```

## Styling

- All components use `cn()` helper with Tailwind classes
- Category colors defined as CSS variables in the component or a shared constant
- Node and tooltip styles follow shadcn card/badge patterns
- Controls use shadcn `Button` component with `ghost` and `outline` variants
- Dark mode compatible via existing theme tokens
