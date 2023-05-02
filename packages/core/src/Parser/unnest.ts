import { Node } from 'unist'
import { Transformer } from 'unified'

type Tree = Node & { children?: Tree[] }

/**
 * Many default parsers create an AST that looks like
 * 
 *     root:
 *       children:
 *         - type: paragraph
 *           children:
 *             - type: singleton
 * 
 * which renders as <p><singleton/></p>. This transformer removes the wrapping
 * <p/> node 
 * 
 *     root:
 *       children:
 *         - type: singleton
 * 
 * to allow for inline-only <singleton/> elements.
 */
export const unnest = () => {
  const transformer: Transformer<Tree> = (tree) => {
    if (
      tree &&
      tree.children?.length === 1 &&
      tree.children[0].type === 'paragraph' &&
      tree.children[0].children?.length === 1
    ) {
      return {
        ...tree,
        children: tree.children[0].children,
      }
    }

    return tree
  }

  return transformer
}
