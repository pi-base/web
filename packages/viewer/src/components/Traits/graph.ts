import * as katex from 'katex'
import { formula } from '@pi-base/core'
import type { Property, Theorem, Trait } from '@/models'

export type Node = d3.SimulationNodeDatum & {
  property: Property
  degree: number
  trait?: Trait
  kind?: 'assumed' | 'deduced'
  pinned?: { x?: number; y?: number }
}

export type Link = d3.SimulationLinkDatum<Node> & { theorem: Theorem }

export type Graph = { nodes: Node[]; links: Link[] }

// Build graph
// - one node per property
// - theorems correspond to edges linking "when" and "then" (note that theorems
//   with compound formulas may correspond to multiple edges)
export function toGraph(
  property: Property,
  traits: [Property, Trait][],
  theorems: Theorem[],
): Graph {
  const nodes: Record<string, Node> = {}
  const links = []

  for (const theorem of theorems) {
    for (const a of formula.properties(theorem.when)) {
      nodes[a.id] ||= { property: a, degree: 0 }
      nodes[a.id].degree++

      for (const c of formula.properties(theorem.then)) {
        nodes[c.id] ||= { property: c, degree: 0 }
        nodes[c.id].degree++

        links.push({
          source: a.id.toString(),
          target: c.id.toString(),
          theorem,
        })
      }
    }
  }

  nodes[property.id].kind = 'deduced'

  for (const [property, trait] of traits) {
    nodes[property.id] ||= { property, degree: 0 }
    nodes[property.id] = { ...nodes[property.id], kind: 'assumed', trait }
  }

  return { nodes: Object.values(nodes), links }
}

export function pin(graph: Graph, bound: number) {
  for (const n of graph.nodes) {
    if (n.kind === 'deduced') {
      n.fx = bound
      n.fy = 1
      n.pinned = { x: bound, y: 1 }
    } else if (n.kind === 'assumed') {
      n.fx = -1 * bound
      n.pinned = { x: -1 * bound }
    }
  }
}

// Adding a vertex at the midpoint allows using marker-mid to
// draw a shape there.
export function drawLinkWithMidpoint({ source, target }: Link) {
  const { x: x1 = 0, y: y1 = 0 } = source as Node
  const { x: x2 = 0, y: y2 = 0 } = target as Node
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return `M${x1},${y1}L${mx},${my}L${x2},${y2}`
}

// Render a string with embedded $-math
//
// This isn't as robust as full typesetting, but should be
// suitable for rendering space or property names
export function renderLatex(s: string) {
  return s.replaceAll(/\$[^$]+\$/g, p => {
    // FIXME: katex's import typing appears to be wrong
    return (katex as any).default.renderToString(p.replaceAll('$', ''))
  })
}
