import type {
  Formula,
  Property,
  Space,
  Theorem as BTheorem,
  Trait,
} from '@pi-base/core'
export type { Property, Space, Trait } from '@pi-base/core'

export type Theorem = Omit<BTheorem, 'when' | 'then'> & {
  name: string
  when: Formula<Property>
  then: Formula<Property>
}

export type Source = {
  host: string
  branch: string
}

export type Data = {
  properties: Property[]
  spaces: Space[]
  traits: Trait[]
  theorems: BTheorem[]
  etag: string
  sha: string
}
