import { formulaSchema } from './Formula.js'
import { propertySchema, propertyPageSchema } from './Property.js'
import { spaceSchema, spacePageSchema } from './Space.js'
import { theoremSchema } from './Theorem.js'
import { traitSchema } from './Trait.js'

export { type Bundle } from './Bundle.js'
export { type Formula, type And, type Atom, type Or } from './Formula.js'
export { parser } from './Parser.js'
export { type Property, PropertyPage } from './Property.js'
export {
  ImplicationIndex,
  deduceTraits,
  disproveFormula,
  proveTheorem,
} from './Logic/index.js'
export { type Space, SpacePage } from './Space.js'
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
  propertyPage: propertyPageSchema,
  space: spaceSchema,
  spacePage: spacePageSchema,
  theorem: theoremSchema,
  trait: traitSchema,
}
