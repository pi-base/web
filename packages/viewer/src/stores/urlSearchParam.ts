import { onMount } from 'svelte'
import type { Writable } from 'svelte/store'

// Wraps an existing writable store, writing updates to the named URL query
// param, and initializing the store value from that param at mount.
export default function urlSearchParam(
  name: string,
  { subscribe, set }: Writable<string>,
) {
  function parse() {
    return new URL(location.href).searchParams
  }

  onMount(() => {
    set(parse().get(name) || '')
  })

  subscribe(value => {
    const search = parse()

    if (!search) {
      return
    }

    if (value) {
      search.set(name, value)
    } else {
      search.delete(name)
    }

    window.history.replaceState(
      null,
      '',
      search.toString()
        ? `${window.location.pathname}?${search}`
        : window.location.pathname,
    )
  })
}
