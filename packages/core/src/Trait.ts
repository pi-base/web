import { Record } from './Record'

export type Trait = Record & {
  space: string
  property: string
  value: boolean
}