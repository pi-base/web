import { Root, Content } from 'mdast'
import { Transformer } from 'unified'

/**
 * Collapses long descriptions down to a reasonable preview, adding an ellipsis.
 */
function gather(nodes: Content[], to: number) {
  let length = 0
  const acc = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (node.type === 'text') {
      const value = node.value || ''
      if (value.length + length >= to) {
        const fragment = value.slice(0, to - length - value.length) + '...'
        acc.push({ ...node, value: fragment })
        return acc
      } else {
        acc.push(node)
        length = length + value.length + 1
      }
    } else {
      if (length + 3 >= to) {
        acc.push(node)
        acc.push({ type: 'text', value: '...' })
        return acc
      } else {
        acc.push(node)
        length = length + 3
      }
    }
  }

  return acc
}

export function truncation(to = 100): Transformer<Root, Root> {
  return function transformer(tree: Root) {
    const node = tree.children[0] || {}

    if ('children' in node) {
      return {
        ...node,
        type: 'root',
        children: gather(node.children, to),
      } as Root
    } else {
      return { ...node, type: 'root' } as Root
    }
  }
}
