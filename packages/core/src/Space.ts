import { Record } from './Record'

export type Space = Record & {
  name: string
  slug: string | undefined
  aliases: string[]
  ambiguous_construction: boolean
}
