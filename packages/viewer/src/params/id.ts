import type { ParamMatcher } from '@sveltejs/kit'
import { Id } from '@pi-base/core'

export const match: ParamMatcher = param => {
  return Id.tag(param) !== null
}
