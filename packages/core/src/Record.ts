import { Ref } from './Ref.js'

export type Record = {
  uid: string
  counterexamples_id: string | undefined
  description: string
  refs: Ref[]
}
