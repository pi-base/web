import { Record } from './Record'

export type Property = Record & {
  name: string
  aliases: string[]
}

