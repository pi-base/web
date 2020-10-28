import type { Property, Space, Theorem, Trait } from '@pi-base/core'
export type { Property, Space, Theorem, Trait } from '@pi-base/core'

export type Source = {
  host: string
  branch: string
}

export type Data = {
  properties: Property[]
  spaces: Space[]
  traits: Trait[]
  theorems: Theorem[]
  etag: string
  sha: string
}
