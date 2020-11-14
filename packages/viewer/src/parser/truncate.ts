import type * as unified from 'unified'
import type * as unist from 'unist'

type Node = unist.Node & {
  children?: Node[]
  value?: string
}

function gather(nodes: Node[], to: number) {
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

export default function truncate(to = 100) {
  return function transformer(tree: Node) {
    const node = (tree.children || [])[0] || {}

    return { ...node, children: gather(node.children || [], to) }
  }
}
