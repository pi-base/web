import { writable } from 'svelte/store'

export type Direction = 'asc' | 'desc'

export type Sort<Field> = {
  field: Field
  direction: Direction
} | null

export function apply<T>(sort: Sort<keyof T>, items: T[]) {
  if (!sort) {
    return items
  }

  const { field, direction } = sort
  return items.sort((a: T, b: T) => {
    if (a[field] > b[field]) {
      return direction === 'asc' ? 1 : -1
    } else if (a[field] < b[field]) {
      return direction === 'asc' ? -1 : 1
    } else {
      return 0
    }
  })
}

export function store<Field>() {
  const { set, subscribe, update } = writable<Sort<Field>>(null)

  return {
    subscribe,
    reset() {
      set(null)
    },
    toggle(field: Field) {
      return update(current => {
        if (current && current.field === field && current.direction === 'asc') {
          return { field, direction: 'desc' }
        } else {
          return { field, direction: 'asc' }
        }
      })
    },
  }
}
