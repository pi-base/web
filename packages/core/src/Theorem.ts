import { Record } from './Record'
import { Formula } from './Formula'

export type Theorem = Record & {
  when: Formula<string>
  then: Formula<string>
  converse?: string[]
}