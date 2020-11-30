import Fuse from 'fuse.js'
import { Readable, Writable, writable } from 'svelte/store'

import { formula as F } from '@pi-base/core'

import type { Collection, Formula, Property } from '../../../../models'
import { read } from '../../../../util'

export type State = {
  suggest: boolean
  suggestions: Property[]
  selected: number | undefined
}

export type Store = Readable<State> & {
  changeSelected(delta: number): void
  setSelected(index: number): void
  expand(index?: number): void
}

export function create({
  raw,
  formula,
  properties,
  limit = 10,
}: {
  raw: Writable<string>
  formula: Writable<Formula<Property> | undefined>
  properties: Readable<Collection<Property>>
  limit?: number
}): Store {
  const index = new Fuse<Property>([], {
    keys: [
      { name: 'name', weight: 1 },
      { name: 'aliases', weight: 1 },
    ],
  })

  const initial = { suggest: false, suggestions: [], selected: undefined }
  const { set, subscribe, update } = writable<State>(initial)

  // On properties change, rebuild the index and reset suggestions
  properties.subscribe((collection) => {
    index.setCollection(collection.all)
    process(read(raw))
  })

  // As the raw text changes, re-compute resolved formula
  raw.subscribe(process)

  function process(str: string) {
    // The resolved formula is cached to prevent flickering while typing, but
    // should be cleared if the user deletes the existing text
    if (str.trim() === '') {
      formula.set(undefined)
      set(initial)
      return
    }

    const resolved = resolve(index, str)
    if (resolved) {
      formula.set(resolved)
    }

    // TODO: A common flow is to accept a suggestion then type "space" and "plus"
    // to write a conjunction. In this case, we'd ideally suppress the suggestion
    // expansion on pressing "space".
    const fragment = getFragment(str)
    if (fragment.trim() === '') {
      set(initial)
    } else {
      const suggestions = index.search(fragment, { limit }).map((r) => r.item)
      if (suggestions.length > 0) {
        set({ suggest: true, suggestions, selected: undefined })
      }
    }
  }

  return {
    subscribe,
    changeSelected(delta: number) {
      update(({ suggestions, selected, ...rest }) => ({
        suggestions,
        selected: wrap(selected, delta, suggestions.length),
        ...rest,
      }))
    },
    setSelected(index: number) {
      update((state) => ({ ...state, selected: index }))
    },
    expand(index?: number) {
      update(({ suggestions, selected }) => {
        const suggestion = suggestions[index || selected || 0]
        if (suggestion) {
          raw.update((str) => replaceFragment(str, suggestion.name))
        }
        return initial
      })
    },
  }
}

function resolve(
  index: Fuse<Property>,
  str: string,
): Formula<Property> | undefined {
  const parsed = F.parse(str)
  if (!parsed) {
    return
  }

  return F.compact(F.mapProperty((p) => index.search(p)[0]?.item, parsed))
}

const separatorExp = /[~+&|()!?]/

function getFragment(str: string): string {
  if (str.trim() === '') {
    return ''
  }

  const parts = str.split(separatorExp)
  return parts[parts.length - 1].trimLeft()
}

function replaceFragment(q: string, expanded: string) {
  if (q.trim() === '') {
    return ''
  }
  const frag = getFragment(q)
  if (frag.trim() === '') {
    return q
  }
  return replaceEnd(q, frag, expanded)
}

function replaceEnd(
  haystack: string,
  needle: string,
  replacement: string,
): string {
  const n = haystack.lastIndexOf(needle)
  if (n >= 0) {
    return haystack.substring(0, n) + replacement
  } else {
    return haystack
  }
}

function wrap(current: number | undefined, delta: number, limit: number) {
  if (!limit) {
    return 0
  }

  if (current === undefined) {
    return delta > 0 ? 0 : limit - 1
  }

  let next = current + (delta % limit)
  if (next < 0) {
    next = next + limit
  }
  return next
}
