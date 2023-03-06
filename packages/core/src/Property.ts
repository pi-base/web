import { Record } from './Record.js'

export type Property = Record & {
  name: string
  aliases: string[]
}
