import * as core from '@actions/core'
import glob from 'glob'
import * as fs from 'fs'
import * as yaml from 'yaml-front-matter'

import { Property, Ref, Space, Theorem, Trait } from './Bundle'

const checkRest = (rest: any[]) => {
  if (Object.keys(rest).length === 0) {
    return
  }

  // TODO: these should fail the build
  core.warning(`Found unexpected fields in source: ${JSON.stringify(rest)}`)
}

const parseRefs = (refs: any[]): Ref[] => {
  return refs as Ref[] // TODO
}

export const property = (raw: string): Property | null => {
  const {
    uid,
    counterexamples_id,
    name,
    aliases,
    slug,
    refs,
    __content,
    ...rest
  } = yaml.loadFront(raw)

  checkRest(rest)

  return {
    uid,
    counterexamples_id,
    name,
    aliases,
    slug,
    refs: parseRefs(refs),
    description: __content
  }
}

export const space = (raw: string): Space | null => {
  const {
    uid,
    counterexamples_id,
    name,
    aliases,
    slug,
    refs,
    ambiguous_construction,
    __content,
    ...rest
  } = yaml.loadFront(raw)

  checkRest(rest)

  return {
    uid,
    counterexamples_id,
    name,
    aliases,
    slug,
    refs: parseRefs(refs),
    description: __content, // TODO: proof of topology section
    ambiguous_construction
  }
}

export const theorem = (raw: string): Theorem | null => {
  const {
    uid,
    counterexamples_id,
    refs,
    then,
    converse,
    __content,
    ...rest
  } = yaml.loadFront(raw)

  const if_ = rest['if']
  delete rest['if']

  checkRest(rest)

  return {
    uid,
    counterexamples_id,
    if_,
    then,
    converse,
    refs: parseRefs(refs),
    description: __content
  }
}

export const trait = (raw: string): Trait | null => {
  const {
    uid,
    counterexamples_id,
    space,
    property,
    value,
    refs,
    __content,
    ...rest
  } = yaml.loadFront(raw)

  checkRest(rest)

  return {
    uid,
    counterexamples_id,
    space,
    property,
    value,
    description: __content,
    refs: parseRefs(refs)
  }
}

export async function parse<T>(
  pattern: string,
  parser: (raw: string) => T | null
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    glob(pattern, (err, files) => {
      if (err) {
        return reject(err)
      }

      const parsed = files.reduce((acc: T[], file: string) => {
        const contents = fs.readFileSync(file).toString()
        const result = parser(contents)
        return result ? acc.concat(result) : acc
      }, [])

      resolve(parsed)
    })
  })
}
