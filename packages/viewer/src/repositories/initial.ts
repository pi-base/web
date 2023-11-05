import type { Prestore } from '@/stores'
import * as Deduction from '@/stores/deduction'
import * as Src from '@/stores/source'

const initial: Prestore = {
  properties: [],
  spaces: [],
  theorems: [],
  traits: [],
  source: Src.initial,
  sync: undefined,
  deduction: Deduction.initial,
}

export default initial
