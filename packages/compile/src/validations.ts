import { z } from 'zod'
import * as yaml from 'yaml-front-matter'

import { Property, bundle as b } from '@pi-base/core'
import * as Formula from '@pi-base/core/lib/Formula'

import { File } from './fs'

export type Message = {
  path: string
  message: string
}

// errors with value    ~ warnings
// errors without value ~ fatal error
export type Result<T> = {
  value?: T
  errors: Message[]
}

export type Validator<I, O> = (input: I) => Result<O>

type Handler = (message: string, key?: string) => void

function check(
  _bundle: b.Bundle,
  _space: unknown,
): {
  kind: 'contradiction'
  contradiction: { properties: string[]; theorems: string[] }
} {
  // FIXME
  return {
    kind: 'contradiction',
    contradiction: { properties: [], theorems: [] },
  }
}

function loadFront(raw: string): any {
  return yaml.safeLoadFront(raw)
}

function load<T>(schema: z.ZodSchema<T>, raw: string): T {
  // TODO: use safeParse
  return schema.parse(yaml.safeLoadFront(raw))
}

export function all<I, O>(
  validator: Validator<I, O>,
  inputs: I[],
): Result<O[]> {
  const out: Result<O[]> = { value: [], errors: [] }

  inputs.forEach((input) => {
    const { value, errors } = validator(input)
    if (value && out.value) {
      out.value.push(value)
    } else {
      out.value = undefined
    }
    out.errors = out.errors.concat(...errors)
  })

  return out
}

function validate<T>(
  path: string,
  handler: (error: Handler) => T | undefined,
): Result<T> {
  const result: Result<T> = { errors: [] }

  const error = (message: string, key: string = path) => {
    result.errors.push({ path: key, message })
  }

  result.value = handler(error)

  return result
}

function duplicated<T>(values: T[]) {
  const seen = new Set<T>()
  const dupes = new Set<T>()

  values.forEach((value) => {
    if (seen.has(value)) {
      dupes.add(value)
    }
    seen.add(value)
  })

  return Array.from(dupes)
}

function noExtras(rest: Record<string, unknown>, error: Handler) {
  if (Object.keys(rest).length > 0) {
    error(`unexpected extra fields: ${Object.keys(rest).join(', ')}`)
  }
}

function required<T>(value: T, key: keyof T, error: Handler) {
  if (!value[key] && (value[key] as unknown) !== false) {
    error(`${key as string} is required`)
  }
}

const paths = {
  property(p: string) {
    return `properties/${p}.md`
  },
  space(s: string) {
    return `spaces/${s}/README.md`
  },
  theorem(t: string) {
    return `theorems/${t}.md`
  },
  trait({ space, property }: { space: string; property: string }) {
    return `spaces/${space}/properties/${property}.md`
  },
}

const refSchema = z.intersection(
  z.object({ name: z.string() }),
  z.union([
    z.object({ doi: z.string() }),
    z.object({ wikipedia: z.string() }),
    z.object({ mr: z.string() }),
    z.object({ mathse: z.string() }),
    z.object({ mo: z.string() }),
  ]),
)

const recordFields = {
  uid: z.string(),
  counterexamples_id: z.string(),
  refs: z.array(refSchema),
  __content: z.string(),
}

const spaceSchema = z.object({
  ...recordFields,
  name: z.string(),
  aliases: z.array(z.string()),
  slug: z.optional(z.string()),
  ambiguous_construction: z.boolean(),
})

const propertySchema = z.object({
  ...recordFields,
  name: z.string(),
  aliases: z.array(z.string()),
  slug: z.optional(z.string()),
})

// FIXME: union: and, or
const formulaSchema = z.object({
  property: z.string(),
  value: z.boolean(),
})

const theoremSchema = z.object({
  ...recordFields,
  converse: z.array(z.string()),
  if: formulaSchema,
  then: formulaSchema,
})

export function property(input: File): Result<Property> {
  return validate(input.path, (error) => {
    const {
      counterexamples_id,
      uid = '',
      name = '',
      aliases = [],
      refs = [],
      __content: description = '',
    } = load(propertySchema, input.contents)

    const property = {
      counterexamples_id,
      uid: String(uid).trim(),
      name: String(name).trim(),
      aliases,
      refs,
      description: String(description).trim(),
    }

    if (!input.path.endsWith(paths.property(uid))) {
      error(`path does not match uid=${uid}`)
    }

    required(property, 'uid', error)
    required(property, 'name', error)
    required(property, 'description', error)
    // TODO: noExtras(rest, error)

    return property
  })
}

export function space(input: File) {
  return validate(input.path, (error) => {
    const {
      counterexamples_id,
      uid = '',
      name = '',
      aliases = [],
      refs = [],
      ambiguous_construction,
      __content: description = '',
    } = load(spaceSchema, input.contents)

    const space = {
      uid: String(uid).trim(),
      counterexamples_id,
      name: String(name).trim(),
      description: String(description).trim(),
      aliases,
      refs,
      ambiguous_construction,
    }

    if (!input.path.endsWith(paths.space(uid))) {
      error(`path does not match uid=${uid}`)
    }

    required(space, 'uid', error)
    required(space, 'name', error)
    required(space, 'description', error)
    // TODO: noExtras(rest, error)

    return space
  })
}

export function theorem(input: File) {
  return validate(input.path, (error) => {
    const {
      counterexamples_id,
      uid = '',
      if: when,
      then,
      refs = [],
      converse,
      __content: description = '',
      ...rest
    } = load(theoremSchema, input.contents)

    const theorem = {
      counterexamples_id,
      uid: String(uid).trim(),
      // FIXME
      when: when && Formula.fromJSON(when as any),
      then: then && Formula.fromJSON(then as any),
      description: String(description).trim(),
      refs,
      converse,
    }

    if (!input.path.endsWith(paths.theorem(uid))) {
      error(`path does not match uid=${uid}`)
    }

    required(theorem, 'uid', error)
    required(theorem, 'when', error)
    required(theorem, 'then', error)
    required(theorem, 'description', error)
    // TODO: noExtras(rest, error)

    return theorem
  })
}

const traitSchema = z.object({
  ...recordFields,
  space: z.string(),
  property: z.string(),
  value: z.boolean(),
})

export function trait(input: File) {
  return validate(input.path, (error) => {
    const {
      uid = '',
      counterexamples_id,
      space = '',
      property = '',
      value,
      refs = [],
      __content: description = '',
      ...rest
    } = load(traitSchema, input.contents)

    const trait = {
      uid: String(uid).trim(),
      space: String(space).trim(),
      property: String(property).trim(),
      value: Boolean(value),
      counterexamples_id,
      refs,
      description,
    }

    if (!input.path.endsWith(paths.trait({ space, property }))) {
      error(`path does not match space=${space} and property=${property}`)
    }

    required(trait, 'space', error)
    required(trait, 'property', error)
    required(trait, 'value', error)
    required(trait, 'description', error)
    // noExtras(rest, error)

    return trait
  })
}

export function bundle(bundle: b.Bundle): Result<b.Bundle> {
  return validate('', (error) => {
    const duplicatePropertyNames = duplicated(
      Array.from(bundle.properties.values()).map((s) => s.name),
    )
    if (duplicatePropertyNames.length > 0) {
      error(`Duplicate property names: ${duplicatePropertyNames.join(', ')}`)
    }

    const duplicateSpaceNames = duplicated(
      Array.from(bundle.spaces.values()).map((s) => s.name),
    )
    if (duplicateSpaceNames.length > 0) {
      error(`Duplicate space names: ${duplicateSpaceNames.join(', ')}`)
    }

    bundle.traits.forEach((trait) => {
      const errorKey = paths.trait(trait)

      if (!bundle.properties.has(trait.property)) {
        error(`unknown property=${trait.property}`, errorKey)
      }
      if (!bundle.spaces.has(trait.space)) {
        error(`unknown space=${trait.space}`, errorKey)
      }
    })

    bundle.theorems.forEach((theorem) => {
      const key = paths.theorem(theorem.uid)

      Formula.properties(theorem.when).forEach((id) => {
        if (!bundle.properties.has(id)) {
          error(`if references unknown property=${id}`, key)
        }
      })

      Formula.properties(theorem.then).forEach((id) => {
        if (!bundle.properties.has(id)) {
          error(`then references unknown property=${id}`, key)
        }
      })

      if (theorem.converse) {
        theorem.converse.forEach((id) => {
          if (!bundle.theorems.has(id)) {
            error(`converse references unknown theorem=${id}`, key)
          }
        })
      }
    })

    const result = bundle

    for (const space of result.spaces.values()) {
      const key = paths.space(space.uid)
      const checked = check(bundle, space)
      switch (checked.kind) {
        // case 'bundle':
        //   result = checked.bundle
        //   break
        case 'contradiction':
          error(
            `properties=${checked.contradiction.properties.join(
              ', ',
            )} contradict theorems=${checked.contradiction.theorems.join(
              ', ',
            )}`,
            key,
          )
          break
      }
    }

    return result
  })
}
