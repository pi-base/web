import { Record } from './Record'

export type Space = Record & {
  name: string
  aliases: string[]
  ambiguous_construction: boolean
}
