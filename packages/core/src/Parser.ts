import { Data, Node } from 'unist'
import { Processor, unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMath from 'remark-math'
import remarkRehype from 'remark-rehype'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'

import { links } from './Parser/links.js'
import { unnest } from './Parser/unnest.js'

/**
 * Full parser chain translating Markdown to HTML, including rendering math and
 * custom π-base syntax extensions.
 */
export function parser(): Processor<Node<Data>, Node<Data>, Node<Data>, void> {
  return unified()
    .use(remarkParse)
    .use(links)
    .use(unnest)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypeStringify)
}
