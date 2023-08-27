import { Data, Node } from 'unist'
import { Processor, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

import { Linkers } from './Parser/types.js'
import { links } from './Parser/links.js'
import { references } from './Parser/references.js'
import { truncate as truncator } from './Parser/truncate.js'
import { unnest } from './Parser/unnest.js'

export type Options = {
  link: Linkers
  truncate?: boolean
}

/**
 * Full parser chain translating Markdown to an HTML string, including rendering
 * math and custom π-base syntax extensions.
 *
 * TODO: Ideally we wouldn't need to provide the `link` and `truncate` controls
 * at parse time, but would instead parse the full document and build a Svelte
 * component tree that could re-render when its context and props changed.
 * Something like https://github.com/syntax-tree/hast-util-to-jsx-runtime may be
 * able to support this. Rendering to <custom-elements/> that are backed by
 * Svelte components may also be an option (assuming they could subscribe to
 * global context and CSS).
 *
 * References:
 *
 * - MDAST - Markdown abstract syntax tree - https://github.com/syntax-tree/mdast
 * - HAST - Hypertext abstract syntax tree - https://github.com/syntax-tree/hast
 */
export function parser({
  link,
  truncate = false,
}: Options): Processor<Node<Data>, Node<Data>, Node<Data>, void> {
  return (
    unified()
      // Parse markdown text to mdast
      .use(remarkParse)
      // Extend markdown tokenization with {internal} and {{external}} links
      .use(links)
      // Convert {internal} and {{external}} mdast nodes to standard mdast link
      // nodes, using passed down linkers to generate href and title
      .use(references(link))
      // Automatically remove outermost paragraph wrapper
      .use(unnest)
      // Parse $ and $$ blocks in text as math
      .use(remarkMath)
      // Convert standard mdast nodes to hast
      .use(remarkRehype)
      // Convert math nodes to hast
      .use(rehypeKatex)
      // Optionally trim mdast to a minimal preview
      .use(truncator, {
        maxChars: 100,
        disable: !truncate,
        ignoreTags: ['math', 'inline-math'],
      })
      // Render hast to HTML string
      .use(rehypeStringify)
  )
}

/**
 * Utility plugin. Use noOp(true) to log the current syntax tree at this point
 * in the chain.
 */
function noOp(log = false) {
  return (tree: Node) => {
    if (log) {
      console.log(tree)
    }

    return tree
  }
}
