import { Parser } from '@pi-base/core'

import link, { Linkers } from './link'
import truncate from './truncate'

export type Options = {
  linkers?: Linkers
}

export function parser({ linkers = {} }: Options) {
  /* eslint-disable */
  // @ts-ignore
  const parser = () => Parser.html().use(link(linkers))

  return async function parse(body: string, truncated = false) {
    const p = truncated ? parser().use(truncate) : parser()
    return Parser.renderHTML(p, body)
  }
  /* eslint-enable */
}
