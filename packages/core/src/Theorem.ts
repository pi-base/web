import { Record } from './Record.js'
import { Formula } from './Formula.js'

export type Theorem = Record & {
  when: Formula<string>
  then: Formula<string>
  converse?: string[]
}
