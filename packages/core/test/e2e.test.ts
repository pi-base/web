import { beforeAll, expect, it } from 'vitest'
import fs from 'fs/promises'

import { ImplicationIndex, proveTheorem } from '../src'
import { Bundle, deserialize } from '../src/Bundle'
import { and, atom } from '../src/Formula'

let bundle: Bundle
let theorems: ImplicationIndex

beforeAll(async () => {
  const serialized = await fs.readFile('./test/fixtures/bundle.min.json')
  bundle = deserialize(JSON.parse(serialized.toString()))
  theorems = new ImplicationIndex(
    [...bundle.theorems.values()].map(({ uid, when, then }) => ({
      id: uid,
      when,
      then,
    })),
  )
})

it('can prove simple implications', () => {
  const result = proveTheorem(
    theorems,
    atom('P000008'), // T5
    atom('P000003'), // T2
  )

  expect(result).toEqual([
    'T000112', // T5 => T4
    'T000113', // T4 => T3.5
    'T000114', // T3.5 => Completely Hausdorff
    'T000086', // Completely Hausdorff => T2.5
    'T000032', // T2.5 => T2
  ])
})

it('can prove compound implications', () => {
  const result = proveTheorem(
    theorems,
    atom('P000052'), // Discrete
    and(
      atom('P000049'), // Extremally Disconnected
      atom('P000053'), // Metrizable
    ),
  )

  expect(result).toEqual([
    'T000085', // Discrete => Completely metrizable
    'T000077', // Completely metrizable => Metrizable
    'T000044', // Discrete => Extemally Disconnected
  ])
})
