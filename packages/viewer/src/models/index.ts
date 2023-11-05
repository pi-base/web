export * from '@/types'

export { Id } from '@pi-base/core'

export { default as Collection } from './Collection'
export { default as Theorem } from './Theorem'
export { default as Theorems } from './Theorems'
export { default as Traits } from './Traits'

import type { Property as P, Trait as Tr } from '@/types'
import type { default as Th } from './Theorem'

export type Proof = {
  traits: [P, Tr][]
  theorems: Th[]
}
