import type { Property, Space, Theorem as BTheorem, Trait } from '@pi-base/core'
export type { Formula, Property, Space, Trait } from '@pi-base/core'

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
