import { Bundle, Version } from '@pi-base/core'
import * as B from '@pi-base/core/lib/Bundle'

import { File, readFiles } from './fs'
import * as Validations from './validations'
import { find as findVersion } from './version'

export function rootDirectories(repo: string) {
  return [`${repo}/properties`, `${repo}/spaces`, `${repo}/theorems`]
}

export default async function load(repo: string): Promise<{
  bundle?: Bundle
  errors?: Map<string, string[]>
}> {
  return validate({
    properties: await readFiles(`${repo}/properties/*.md`),
    spaces: await readFiles(`${repo}/spaces/*/README.md`),
    theorems: await readFiles(`${repo}/theorems/*.md`),
    traits: await readFiles(`${repo}/spaces/*/properties/*.md`),
    version: await findVersion(),
  })
}

export function validate({
  properties = [],
  spaces = [],
  theorems = [],
  traits = [],
  version,
}: {
  properties?: File[]
  spaces?: File[]
  theorems?: File[]
  traits?: File[]
  version: Version
}) {
  let bundle: Bundle | undefined

  try {
    bundle = B.deserialize({
      properties: checkAll(Validations.property, properties),
      spaces: checkAll(Validations.space, spaces),
      theorems: checkAll(Validations.theorem, theorems),
      traits: checkAll(Validations.trait, traits),
      version,
    })

    return format(Validations.bundle(bundle))
  } catch (e) {
    if (e instanceof ValidationError) {
      return format({ value: bundle, errors: e.messages })
    } else {
      throw e
    }
  }
}

class ValidationError extends Error {
  messages: Validations.Message[]

  constructor(message: string, messages: Validations.Message[]) {
    super(message)

    this.name = 'ValidationError'
    this.messages = messages
  }
}

function checkAll<I, O>(
  validator: Validations.Validator<I, O>,
  inputs: I[],
): O[] {
  const result = Validations.all(validator, inputs)

  if (result.errors.length > 0 || !result.value) {
    throw new ValidationError('Validation failed', result.errors)
  }

  return result.value
}

function format({ value, errors }: Validations.Result<Bundle>): {
  bundle?: Bundle
  errors?: Map<string, string[]>
} {
  if (errors.length > 0) {
    const grouped = new Map()
    errors.forEach(({ path, message }) => {
      if (!grouped.has(path)) {
        grouped.set(path, [])
      }
      grouped.get(path).push(message)
    })

    return { bundle: value, errors: grouped }
  } else {
    return { bundle: value }
  }
}
