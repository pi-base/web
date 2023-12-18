<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { Value } from '../Traits'
  import context from '@/context'
  import type { Property, Space, Trait, Traits } from '@/models'
  import { capitalize } from '@/util'
  import { writable } from 'svelte/store'
  import urlSearchParam from '@/stores/urlSearchParam'

  export let related: (traits: Traits) => [Space, Property, Trait][]
  export let mode: 'spaces' | 'properties'

  const { traits } = context()

  const filter = writable('')
  urlSearchParam('filter', filter)

  let showDeduced = true

  function toggleDeduced() {
    showDeduced = !showDeduced
  }

  $: all = related($traits)
  // all has type [Space, Property, Trait][]
  // we need to index names in different positions depending on which kind we
  // are displaying
  $: index = new Fuse(all, { keys: [`${mode === 'spaces' ? 0 : 1}.name`] })
  $: searched = $filter ? index.search($filter).map(r => r.item) : all
  $: filtered = searched.filter(
    ([_space, _property, t]) => showDeduced || t.asserted,
  )
</script>

<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text">
      <Icons.Search />
    </span>
  </div>
  <input placeholder="Filter" class="form-control" bind:value={$filter} />
  <div class="input-group-append">
    <button
      class="btn btn-outline-secondary {!showDeduced ? 'active' : ''}"
      type="button"
      on:click={toggleDeduced}
    >
      {#if showDeduced}
        Hide <Icons.Robot />
      {:else}
        Show <Icons.Robot />
      {/if}
    </button>
  </div>
</div>

<table class="table related-traits">
  <thead>
    <tr>
      <th style="width:5%;text-align:center">Id</th>
      <th style="width:5%;text-align:center">Value</th>
      <th style="width:85%">Name</th>
      <th style="width:5%;text-align:center">Source</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [space, property, trait] ([space.id, property.id])}
      <tr>
        <td style="text-align:center">
          <slot name="id" {space} {property} />
        </td>
        <td style="text-align:center">
          <Link.Trait {space} {property}>
            <Value value={trait.value} />
          </Link.Trait>
        </td>
        <td>
          <slot name="name" {space} {property} />
        </td>
        <td style="text-align:center">
          <Link.Trait {space} {property}>
            <Value value={trait.asserted} icon="user" />
          </Link.Trait>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
