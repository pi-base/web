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

  let showDeduced = true

  function toggleDeduced() {
    showDeduced = !showDeduced
  }

  let showMissing = false

  function toggleMissing() {
    showMissing = !showMissing
  }

  let showAsserted = true

  function toggleKnown() {
    showAsserted = !showAsserted
  }

  $: all = related($traits)
  // all has type [Space, Property, Trait][]
  // we need to index names in different positions depending on which kind we
  // are displaying
  $: index = new Fuse(all, { keys: [`${mode === 'spaces' ? 0 : 1}.name`] })
  $: searched = $filter ? index.search($filter).map(r => r.item) : all
  $: filtered = searched.filter(([_space, _property, t]) =>
    t ? (t.asserted ? showAsserted : showDeduced) : showMissing,
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
      class="btn btn-outline-secondary {!showAsserted ? 'active' : ''}"
      type="button"
      on:click={toggleKnown}
    >
      {#if showAsserted}
        Hide <Icons.User /> 
      {:else}
        Show <Icons.User /> 
      {/if}
    </button>
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
    <button
      class="btn btn-outline-secondary {!showMissing ? 'active' : ''}"
      type="button"
      on:click={toggleMissing}
    >
      {#if showMissing}
        Hide <Icons.Question />
      {:else}
        Show <Icons.Question />
      {/if}
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
