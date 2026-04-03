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
