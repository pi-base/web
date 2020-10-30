import toH from 'hast-to-hyperscript'
import h from 'hyperscript'
import rehypeKatex from 'rehype-katex'
import remark from 'remark'
import remarkRehype from 'remark-rehype'
import type unified from 'unified'

import link, { Linkers } from './link'
import pibase from './pibase'
import truncate_ from './truncate'

export type Options = {
  linkers?: Linkers
  truncate?: boolean
}

export function parser({ linkers = {}, truncate = false }: Options) {
  const transformers: unified.Attacher[] = [pibase, remarkRehype]

  if (truncate) {
    transformers.push(truncate_)
  }

  transformers.push(rehypeKatex, link(linkers))

  const parser = transformers.reduce(
    (acc, transformer) => acc.use(transformer),
    remark(),
  )

  return async function parse(body: string) {
    const parsed = await parser.run(parser.parse(body))
    return toH(h, parsed).innerHTML
  }
}
