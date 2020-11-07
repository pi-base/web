<script lang="ts">
  import Fuse from 'fuse.js'
  import type { Writable } from 'svelte/store'
  import * as F from '@pi-base/core/lib/Formula'

  import context from '../../context'
  import type { Formula, Property } from '../../models'

  export let raw: Writable<string>
  export let formula: Writable<Formula<Property> | undefined>
  export let name: string
  export let placeholder: string | undefined = undefined

  const { properties } = context()

  const index = new Fuse<Property>($properties.all, {
    keys: [
      { name: 'name', weight: 1 },
      { name: 'aliases', weight: 1 },
    ],
  })

  $: index.setCollection($properties.all)

  raw.subscribe((f) => {
    if (f.trim() === '') {
      formula.set(undefined)
      return
    }

    const parsed = F.parse(f)
    if (!parsed) {
      return
    }

    const resolved = F.compact(
      F.mapProperty((p) => index.search(p)[0]?.item, parsed),
    )

    if (resolved) {
      formula.set(resolved)
    }
  })
</script>

<input class="form-control" {name} {placeholder} bind:value={$raw} />
