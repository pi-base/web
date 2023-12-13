import { Root } from 'mdast'
import { Transformer } from 'unified'

type Opts = {
  disable?: boolean
  ellipses?: string
  maxChars?: number
  ignoreTags?: string[]
}

// Adapted from https://github.com/luk707/rehype-truncate
export function truncate({
  disable = false,
  ellipses = '\u2026',
  ignoreTags = [],
  maxChars = 120,
}: Opts = {}): Transformer<Root, Root> {
  return truncator

  function truncator(tree: Root) {
    if (!disable) {
      truncateNode(tree)
    }
  }

  function truncateNode(node: any, tf = 0) {
    let foundText = tf

    if (node.type === 'text') {
      foundText += node.value.length

      if (foundText >= maxChars) {
        node.value = `${node.value.slice(
          0,
          node.value.length - (foundText - maxChars),
        )}${ellipses}`
        return maxChars
      } else if (node.value === '\n') {
        node.value = ''
        return maxChars
      }
    }

    if (node.type === 'root' || node.type === 'element') {
      if (node.type === 'element' && ignoreTags.includes(node.tagName)) {
        return foundText
      }
      for (let i = 0; i < node.children.length; i++) {
        if (foundText === maxChars) {
          node.children.splice(i, 1)
          i--
          continue
        }
        foundText = truncateNode(node.children[i], foundText)
      }
    }

    return foundText
  }
}
