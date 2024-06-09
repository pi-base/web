import { Ref } from '@pi-base/core'

export function external([kind, id]: [Ref.Kind, string]) {
  return Ref.format({ kind, id })
}
