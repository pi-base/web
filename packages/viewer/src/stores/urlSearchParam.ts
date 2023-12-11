import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { page } from '$app/stores'
import { onMount } from 'svelte'
import { get, type Writable } from 'svelte/store'

// Wraps an existing writable store, writing updates to the named URL query
// param, and initializing the store value from that param at mount.
export default function urlSearchParam(
  name: string,
  { subscribe, set }: Writable<string>,
  mountCallback?: () => any,
) {
  if (!browser) {
    return
  }

  function parse() {
    return new URL(get(page).url)
  }

  onMount(() => {
    set(parse().searchParams.get(name) || '')
    mountCallback && mountCallback()
  })

  let initialized = false
  subscribe(value => {
    const url = parse()

    if (!url.searchParams) {
      return
    }

    if (value) {
      url.searchParams.set(name, value)
    } else if (initialized) {
      url.searchParams.delete(name)
    }
    initialized = true

    goto(url, { replaceState: true, keepFocus: true })
  })
}
