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
