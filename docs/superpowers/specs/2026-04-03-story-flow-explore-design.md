# Story Flow Explorer: Dynamic Topic Archaeology

A dynamic extension of the Story Flow page that builds branching timelines from real articles using semantic similarity APIs. Users enter a topic and the system traces the story's evolution backward through time, revealing how it branched into subtopics.

## Page Location

- **Route**: `/demo/story-flow/explore`
- **Layout**: nested under the existing `(dashboard)` layout with sidebar navigation
- **Navigation**: add link to sidebar and homepage grid
- **Relationship**: separate from the static demo at `/demo/story-flow`

## Tech Stack

- **React Flow (`@xyflow/react`)**: canvas rendering, pan/zoom, viewport management, custom nodes/edges (already installed)
- **dagre (`@dagrejs/dagre`)**: automatic top-down tree layout (already installed)
- **Existing**: shadcn/ui styling, Hugeicons, Tailwind CSS v4, oklch color tokens

## Data Model

### Article

The shape returned by both external APIs:

```typescript
type Article = {
  id: string
  title: string
  summary: string
  publishedDate: string    // ISO date string
  url: string
  source: string
  similarityScore: number  // 0-1, relevance to query or parent article
}
```

### TreeNode

Each node in the tree wraps an `Article` with relationship metadata:

```typescript
type TreeNode = {
  article: Article
  parentIds: string[]          // which article(s) traced back to this one (supports convergence)
  depth: number                // 0 = seed articles, 1 = first trace-back, etc.
  status: "leaf" | "expanded" | "exhausted"
  // leaf: hasn't been traced back yet
  // expanded: traceBack was called, children exist
  // exhausted: traceBack returned only low-score results (< 0.4)
}
```

### Tree State

Managed by a React reducer:

```typescript
type TreeState = {
  nodes: Map<string, TreeNode>
  query: string
  phase: "idle" | "searching" | "tracing" | "ready"
  currentDepth: number
}
```

**Actions:**
- `SEARCH_START` / `SEARCH_COMPLETE` — user submits query, seed articles arrive
- `TRACE_START` / `TRACE_COMPLETE` — a batch of trace-back results merges into tree
- `RESET` — clear everything for a new query

**Deduplication:** if two different parents trace back to the same article (same `id`), only one `TreeNode` is created but the parent's ID is added to `parentIds`. Both edges are drawn — showing convergence in the story.

## Service Adapter

Clean interface for swapping mock with real APIs later:

```typescript
interface StoryFlowService {
  searchArticles(query: string): Promise<Article[]>
  traceBack(articleId: string): Promise<Article[]>
}
```

### Mock Implementation

The mock ships with hardcoded data themed around "Trump Tariffs" for predictable development/testing.

**`searchArticles(query)`:**
- Returns 4-6 seed articles
- Titles derived from a realistic tariff news narrative
- Dates clustered in a recent 2-month window
- Similarity scores between 0.75-0.95
- 500ms simulated delay

**`traceBack(articleId)`:**
- Returns 2-4 earlier articles per call
- Dates 1-3 months before the source article
- Similarity scores decrease with depth: first level 0.6-0.85, second 0.45-0.7, third 0.3-0.55
- Some articles shared across branches (same `id`) to demonstrate convergence
- Some branches return only low-score articles early, showing natural exhaustion
- 300ms simulated delay per call

Mock data totals ~25 articles across 3 trace-back levels.

## "Trace Deeper" Logic

When the user clicks "Trace Deeper":

1. Find all nodes with `status: "leaf"` and `article.similarityScore >= 0.4`
2. Call `traceBack(articleId)` for each in parallel
3. Merge returned articles into the tree (deduplicating by ID)
4. Update parent node status to `"expanded"`
5. If a trace-back returns only articles with `similarityScore < 0.4`, mark the parent as `"exhausted"`
6. Increment `currentDepth`
7. Re-run dagre layout and `fitView`

**Stopping condition:** the "Trace Deeper" button is disabled when no `"leaf"` nodes with `similarityScore >= 0.4` remain.

## Page Layout

### Idle State
- Search input centered vertically and horizontally in the canvas area
- No header bar visible
- Minimal: just the input with a placeholder like "Enter a topic to explore..."
- Submit on Enter key

### Searching State
- Header appears with the query text displayed
- Loading indicator in the header
- Canvas area shows a loading state

### Ready State
- **Header bar**: query text (left), controls (right)
- **Controls**: "Trace Deeper" button with depth counter (e.g. "Depth: 2"), "New Search" button
- **Canvas**: React Flow with the tree, pan/zoom enabled

### Canvas
- React Flow fills remaining viewport height (`flex: 1`)
- Same background and zoom controls as static demo
- Dagre layout recomputed when new nodes arrive
- New nodes fade in with a subtle animation (200ms)

## Node Rendering

### Explore Node
- Circular dot, ~32-36px diameter
- Color intensity based on similarity score: high score (>0.8) = vivid primary color, low score (<0.5) = faded/muted
- Border visible on all nodes
- Subtle scale-in animation when first appearing

### Node States
- **Leaf**: solid dot, can be traced deeper
- **Expanded**: ring outline in primary color to indicate it has children
- **Exhausted**: dimmed, indicating no more useful trace-back available

### Hover Tooltip
- Same floating card pattern as static demo
- Contents:
  - Date + source (small, muted, uppercase)
  - Title (medium weight)
  - Summary (small, muted)
  - Similarity score as a subtle badge (e.g. "0.82")
  - Link to original article URL

## Edge Rendering

- Reuses the animated bezier pattern from the static demo
- Edge opacity proportional to the child's similarity score (high score = more visible edge)
- Fade-in animation when new edges appear

## File Structure

```
app/(dashboard)/demo/story-flow/explore/
  page.tsx                          # server component: metadata + imports ExploreFlow
  _components/
    explore-flow.tsx                # "use client" — main component (canvas + search + controls)
    explore-node.tsx                # custom React Flow node: score-colored dot
    explore-tooltip.tsx             # hover tooltip: article details + score
    explore-controls.tsx            # "Trace Deeper" + depth counter + "New Search"
    search-input.tsx                # centered search input for idle state
  _lib/
    types.ts                        # Article, TreeNode, StoryFlowService, TreeState types
    reducer.ts                      # tree state reducer
    use-story-flow.ts               # hook: wraps reducer + service calls + trace logic
    layout.ts                       # dagre layout function (duplicated from static demo)
  _services/
    service.ts                      # StoryFlowService interface + adapter export
    mock-service.ts                 # mock implementation with fake "Trump Tariffs" data
```

**Also modified:**
- `app/(dashboard)/layout.tsx` — add sidebar nav link for "Explore"
- `app/(marketing)/page.tsx` — add homepage grid link

## Styling

- **Minimal design** — consistent with static demo and existing shadcn aesthetic
- Score-based color intensity replaces category-based coloring
- All components use `cn()` helper with Tailwind classes
- Controls use shadcn `Button` component (`default` for "Trace Deeper", `ghost` for "New Search")
- Search input uses shadcn `Input` component
- Tooltip follows shadcn card pattern (border, shadow, bg-card)
- React Flow style overrides from static demo apply here too (shared CSS or duplicated)
- No custom fonts, gradients, or decorative effects
