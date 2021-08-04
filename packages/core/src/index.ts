export { Formula, And, Atom, Or } from './Formula'
export { Property } from './Property'
export {
  ImplicationIndex,
  deduceTraits,
  disproveFormula,
  proveTheorem,
} from './Logic'
export { Space } from './Space'
export { FormulaSchema, Theorem } from './Theorem'
export { Trait } from './Trait'
export { Version } from './Bundle'
export { BundleChecker } from './BundleChecker'

export * as bundle from './Bundle'
export * as formula from './Formula'
export * as Id from './Id'
export * as Ref from './Ref'
export * as Parser from './Parser'
export * as TestUtils from './testUtils'
