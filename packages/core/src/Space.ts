import { Record } from './Record.js'

export type Space = Record & {
  name: string
  aliases: string[]
  ambiguous_construction: boolean
}
