import { Formula } from '../Formula'
import { ImplicationIndex } from '../Logic'

export function recordToMap<Value>(
  record: Record<string, Value>,
): Map<string, Value> {
  const result = new Map<string, Value>()
  for (const key in record) {
    result.set(key, record[key])
  }
  return result
}

export function index<PropertyId = string>(
  ...implications: [Formula<PropertyId>, Formula<PropertyId>][]
): ImplicationIndex<number, PropertyId> {
  return new ImplicationIndex(
    implications.map(([when, then], index) => ({ id: index + 1, when, then })),
  )
}
