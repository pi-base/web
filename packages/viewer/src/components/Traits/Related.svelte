<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { Value } from '../Traits'
  import context from '@/context'
  import type { Property, Space, Trait, Traits } from '@/models'
  import { capitalize } from '@/util'
  import { writable } from 'svelte/store'
  import urlSearchParam from '@/stores/urlSearchParam'

  export let related: (traits: Traits) => [Space, Property, Trait | undefined][]
  export let mode: 'spaces' | 'properties'

  const { traits } = context()

  const filter = writable('')
  urlSearchParam('filter', filter)

  let filterMode: 'all' | 'known' | 'asserted' | 'true' | 'false' | 'missing'
  filterMode = 'known'

  $: all = related($traits)
  // all has type [Space, Property, Trait][]
  // we need to index names in different positions depending on which kind we
  // are displaying
  $: index = new Fuse(all, { keys: [`${mode === 'spaces' ? 0 : 1}.name`] })
  $: searched = $filter ? index.search($filter).map(r => r.item) : all
  $: filtered = searched.filter(([_space, _property, t]) => {
    switch (filterMode) {
      case 'all':
        return true
      case 'known':
        return t
      case 'asserted':
        return t?.asserted
      case 'true':
        return t?.value
      case 'false':
        return t && !t.value
      case 'missing':
        return !t
    }
  })
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
      class="btn btn-outline-secondary {filterMode !== 'all' ? 'active' : ''}"
      type="button"
      on:click={() => {
        filterMode = 'all'
      }}
    >
      Show All
    </button>
    <button
      class="btn btn-outline-secondary {filterMode !== 'known' ? 'active' : ''}"
      type="button"
      on:click={() => {
        filterMode = 'known'
      }}
    >
      <Icons.Check />/
      <Icons.X />
    </button>
    <button
      class="btn btn-outline-secondary {filterMode !== 'true' ? 'active' : ''}"
      type="button"
      on:click={() => {
        filterMode = 'true'
      }}
    >
      <Icons.Check />
    </button>
    <button
      class="btn btn-outline-secondary {filterMode !== 'false' ? 'active' : ''}"
      type="button"
      on:click={() => {
        filterMode = 'false'
      }}
    >
      <Icons.X />
    </button>
    <button
      class="btn btn-outline-secondary {filterMode !== 'asserted'
        ? 'active'
        : ''}"
      type="button"
      on:click={() => {
        filterMode = 'asserted'
      }}
    >
      <Icons.User />
    </button>
    <button
      class="btn btn-outline-secondary {filterMode !== 'missing'
        ? 'active'
        : ''}"
      type="button"
      on:click={() => {
        filterMode = 'missing'
      }}
    >
      <Icons.Question />
    </button>
  </div>
</div>

<table class="table related-traits">
  <thead>
    <tr>
      <th>Id</th>
      <th>{capitalize(mode)}</th>
      <th>Value</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [space, property, trait] ([space.id, property.id])}
      <tr>
        <td>
          <slot name="id" {space} {property} />
        </td>
        <td>
          <slot name="name" {space} {property} />
        </td>
        <td>
          <Link.Trait {space} {property}>
            <Value value={trait?.value} />
          </Link.Trait>
        </td>
        <td>
          <Link.Trait {space} {property}>
            <Value value={trait?.asserted} icon="user" />
          </Link.Trait>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
