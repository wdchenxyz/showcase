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
