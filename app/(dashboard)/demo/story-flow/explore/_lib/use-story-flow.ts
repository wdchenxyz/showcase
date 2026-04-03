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
