import { Data, Node } from 'unist'
import { Processor, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

import { links } from './Parser/links.js'
import { unnest } from './Parser/unnest.js'
import { truncation } from './Parser/truncation.js'

function noOp() {
  return (tree: Node) => tree
}

export type Options = {
  link?: boolean
  truncate?: boolean
}

function trace() {
  return (tree: Node) => {
    console.log(tree)
    return tree
  }
}

/**
 * Full parser chain translating Markdown to HTML, including rendering math and
 * custom π-base syntax extensions.
 */
export function parser({
  link = true,
  truncate = false,
}: Partial<Options> = {}): Processor<Node<Data>, Node<Data>, Node<Data>, void> {
  return unified()
    .use(remarkParse)
    .use(link ? links : noOp)
    .use(unnest)
    .use(remarkMath)
    .use(truncate ? truncation : noOp)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
}
