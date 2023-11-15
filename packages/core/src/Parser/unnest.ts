import { Root } from 'hast'
import { Transformer } from 'unified'

/**
 * Simplifies outer wrapping nodes of ASTs, and
 * ensures that they render an inline / non-block
 * elvel elements.
 */
export const unnest = () => {
  const transformer: Transformer<Root> = tree => {
    if (tree && tree.children?.length === 1 && 'tagName' in tree.children[0]) {
      tree.children = tree.children[0].children

      if ('tagName' in tree.children[0] && tree.children[0].tagName === 'p') {
        tree.children[0].tagName = 'span'
      }
    }

    return tree
  }

  return transformer
}
