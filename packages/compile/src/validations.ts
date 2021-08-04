// FIXME
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import yaml from 'yaml-front-matter'

import {
  Property,
  bundle as Bundle,
  formula as Formula,
  BundleChecker,
} from '@pi-base/core'

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

function loadFront(raw: string): Record<string, any> {
  const loaded = yaml.safeLoadFront(raw)
  if (typeof loaded !== 'object') {
    throw Error(`Loaded unexpected type: ${typeof loaded}`)
  }
  return loaded
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
  if (!value[key] && (value[key] as unknown as boolean) !== false) {
    error(`${String(key)} is required`)
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

export function property(input: File): Result<Property> {
  return validate(input.path, (error) => {
    const {
      counterexamples_id,
      uid = '',
      name = '',
      aliases = [],
      refs = [],
      slug,
      __content: description = '',
      ...rest
    } = loadFront(input.contents)

    const property = {
      counterexamples_id,
      uid: String(uid).trim(),
      name: String(name).trim(),
      aliases,
      refs,
      description: String(description).trim(),
    }

    if (!input.path.endsWith(paths.property(uid))) {
      error(`path does not match uid=${String(uid)}`)
    }

    required(property, 'uid', error)
    required(property, 'name', error)
    required(property, 'description', error)
    noExtras(rest, error)

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
      slug,
      __content: description = '',
      ...rest
    } = loadFront(input.contents)

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
      error(`path does not match uid=${String(uid)}`)
    }

    required(space, 'uid', error)
    required(space, 'name', error)
    required(space, 'description', error)
    noExtras(rest, error)

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
    } = loadFront(input.contents)

    const theorem = {
      counterexamples_id,
      uid: String(uid).trim(),
      when: when && Formula.fromJSON(when),
      then: then && Formula.fromJSON(then),
      description: String(description).trim(),
      refs,
      converse,
    }

    if (!input.path.endsWith(paths.theorem(uid))) {
      error(`path does not match uid=${String(uid)}`)
    }

    required(theorem, 'uid', error)
    required(theorem, 'when', error)
    required(theorem, 'then', error)
    required(theorem, 'description', error)
    noExtras(rest, error)

    return theorem
  })
}

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
    } = loadFront(input.contents)

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
      error(
        `path does not match space=${String(space)} and property=${String(
          property,
        )}`,
      )
    }

    required(trait, 'space', error)
    required(trait, 'property', error)
    required(trait, 'value', error)
    required(trait, 'description', error)
    noExtras(rest, error)

    return trait
  })
}

export function bundle(bundle: Bundle.Bundle): Result<Bundle.Bundle> {
  return validate('', (error) => {
    const duplicatePropertyNames = duplicated(
      bundle.properties.map((s) => s.name),
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

      if (!bundle.property(trait.property)) {
        error(`unknown property=${trait.property}`, errorKey)
      }
      if (!bundle.space(trait.space)) {
        error(`unknown space=${trait.space}`, errorKey)
      }
    })

    bundle.theorems.forEach((theorem) => {
      const key = paths.theorem(theorem.uid)

      Formula.properties(theorem.when).forEach((id) => {
        if (!bundle.property(id)) {
          error(`if references unknown property=${id}`, key)
        }
      })

      Formula.properties(theorem.then).forEach((id) => {
        if (!bundle.property(id)) {
          error(`then references unknown property=${id}`, key)
        }
      })

      if (theorem.converse) {
        theorem.converse.forEach((id) => {
          if (!bundle.theorem(id)) {
            error(`converse references unknown theorem=${id}`, key)
          }
        })
      }
    })

    let result = bundle

    for (const space of result.spaces.values()) {
      const key = paths.space(space.uid)
      const checked = new BundleChecker(result).check(space)
      switch (checked.kind) {
        case 'bundle':
          result = checked.bundle
          break
        case 'contradiction':
          error(
            `properties=${checked.contradiction.properties.join(
              ',',
            )} contradict theorems=${checked.contradiction.theorems.join(',')}`,
            key,
          )
          break
      }
    }

    return result
  })
}
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
