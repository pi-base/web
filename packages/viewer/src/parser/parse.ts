import { Parser } from '@pi-base/core'

import { toH } from 'hast-to-hyperscript'
import h from 'hyperscript'
import rehypeKatex from 'rehype-katex'
import remarkRehype from 'remark-rehype'

import link, { type Linkers } from './link'
import truncate from './truncate'

export type Options = {
  linkers?: Linkers
}

export function parser({ linkers = {} }: Options) {
  const parser = Parser().use(remarkRehype).use(rehypeKatex).use(link(linkers))

  return async function parse(body: string, truncated = false) {
    // FIXME: const p = truncated ? parser().use(truncate) : parser
    const p = parser
    const parsed = await p.run(p.parse(body))
    // FIXME: any
    return toH(h, parsed as any).innerHTML
  }
}
