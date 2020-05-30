export { Bundle } from './Bundle'
export { Formula } from './Formula'
export { Id } from './Id'
export { default as ImplicationIndex } from './Logic/ImplicationIndex'
export { default as Parser } from './Parser'
export { Property } from './Property'
export { default as Prover, disprove } from './Logic/Prover'
export { Ref } from './Ref'
export { Space } from './Space'
export { Theorem } from './Theorem'
export { Trait } from './Trait'
export { Version } from './Bundle'

import * as bundle_ from './Bundle'
import * as formula_ from './Formula'

export const bundle = bundle_
export const formula = formula_
