import type { Node, Edge } from "@xyflow/react"
import Dagre from "@dagrejs/dagre"

export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 70 })

  for (const node of nodes) {
    g.setNode(node.id, { width: 34, height: 34 })
  }
  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  Dagre.layout(g)

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id)
    return { ...node, position: { x: pos.x - 17, y: pos.y - 17 } }
  })

  return { nodes: layoutedNodes, edges }
}
