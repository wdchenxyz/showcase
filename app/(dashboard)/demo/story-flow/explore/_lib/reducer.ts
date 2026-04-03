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

      nodes.set(action.parentId, {
        ...parentNode,
        status: hasHighScoreChild ? "expanded" : "exhausted",
      })

      for (const article of action.articles) {
        const existing = nodes.get(article.id)
        if (existing) {
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
