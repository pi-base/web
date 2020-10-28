import type * as unified from 'unified'
import type * as unist from 'unist'

export default function truncate(): unified.Transformer {
  return function transformer(tree: unist.Node) {
    const children = (tree.children as unist.Node[]) || []

    return {
      ...tree,
      // TODO: add heuristics about the length of this node
      // and bound it.
      children: children.slice(0, 1),
    }
  }
}
