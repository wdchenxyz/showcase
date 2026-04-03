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
