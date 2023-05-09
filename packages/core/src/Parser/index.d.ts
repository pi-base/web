declare module 'rehype-truncate' {
  import { Root } from 'mdast'
  import { Transformer } from 'unified'

  type Opts = {
    disable?: boolean
    ellipses?: string
    maxChars: number
    ignoreTags?: string[]
  }

  export default function rehypeTruncate(opts: Opts): Transformer<Root, Root>
}
