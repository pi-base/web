import { Record } from './Record'

export type Property = Record & {
  name: string
  slug: string | undefined
  aliases: string[]
}

