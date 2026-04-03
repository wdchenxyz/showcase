import type { Article } from "../_lib/types"

export interface StoryFlowService {
  searchArticles(query: string): Promise<Article[]>
  traceBack(articleId: string): Promise<Article[]>
}
