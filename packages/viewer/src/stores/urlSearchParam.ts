import { onMount } from 'svelte'
import type { Writable } from 'svelte/store'

// Wraps an existing writable store, writing updates to the named URL query
// param, and initializing the store value from that param at mount.
export default function urlSearchParam(
  name: string,
  { subscribe, set }: Writable<string>,
) {
  let search: URLSearchParams

  onMount(() => {
    search = new URL(location.href).searchParams
    set(search.get(name) || '')
  })

  subscribe((value) => {
    // There is a possible race condition here if two of these are mounted at
    // once and both changing. Re-parsing search from the current href would
    // decrease this risk, but require more processing.
    if (!search) {
      return
    }

    if (value) {
      search.set(name, value)
    } else {
      search.delete(name)
    }

    // Should this be debounced?
    window.history.replaceState(
      null,
      '',
      search.toString()
        ? `${window.location.pathname}?${search}`
        : window.location.pathname,
    )
  })
}
