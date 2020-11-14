import toH from 'hast-to-hyperscript'
import h from 'hyperscript'
import rehypeKatex from 'rehype-katex'
import remark from 'remark'
import remarkRehype from 'remark-rehype'
import type unified from 'unified'

import link, { Linkers } from './link'
import pibase from './pibase'
import truncate from './truncate'

export type Options = {
  linkers?: Linkers
}

export function parser({ linkers = {} }: Options) {
  const transformers: unified.Attacher[] = [pibase, remarkRehype]

  transformers.push(rehypeKatex, link(linkers))

  const parser = transformers.reduce(
    (acc, transformer) => acc.use(transformer),
    remark(),
  )

  return async function parse(body: string, truncated = false) {
    const p = truncated ? parser().use(truncate) : parser
    const parsed = await p.run(p.parse(body))
    return toH(h, parsed).innerHTML
  }
}
