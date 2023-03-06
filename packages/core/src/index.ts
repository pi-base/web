import { formulaSchema } from './Formula.js'
import { propertySchema } from './Property.js'
import { spaceSchema } from './Space.js'
import { theoremSchema } from './Theorem.js'
import { traitSchema } from './Trait.js'

export { type Bundle } from './Bundle.js'
export { type Formula, type And, type Atom, type Or } from './Formula.js'
export { default as Parser } from './Parser.js'
export { type Property } from './Property.js'
export {
  ImplicationIndex,
  deduceTraits,
  disproveFormula,
  proveTheorem,
} from './Logic/index.js'
export { type Space } from './Space.js'
export { type Theorem } from './Theorem.js'
export { type Trait } from './Trait.js'
export { type Version } from './Bundle.js'

export * as bundle from './Bundle.js'
export * as formula from './Formula.js'
export * as Id from './Id.js'
export * as Ref from './Ref.js'

export * as TestUtils from './testUtils.js'

export const schemas = {
  formula: formulaSchema,
  property: propertySchema,
  space: spaceSchema,
  theorem: theoremSchema,
  trait: traitSchema
}