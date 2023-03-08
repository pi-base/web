<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { Value } from '../Traits'
  import context from '../../context'
  import type { Property, Space, Trait, Traits } from '../../models'

  export let label: string
  export let related: (traits: Traits) => [Space, Property, Trait][]

  const { traits } = context()

  let filter = ''
  let showDeduced = false

  function toggleDeduced() {
    showDeduced = !showDeduced
  }

  $: all = related($traits)
  $: index = new Fuse(all, { keys: ['0.name'] })
  $: searched = filter ? index.search(filter).map((r) => r.item) : all
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
  <input placeholder="Filter" class="form-control" bind:value={filter} />
  <div class="input-group-append">
    <button
      class="btn btn-outline-secondary {showDeduced ? 'active' : ''}"
      type="button"
      on:click={toggleDeduced}>
      Deduced
    </button>
  </div>
</div>

<table class="table">
  <thead>
    <tr>
      <th>{label}</th>
      <th>Value</th>
      <th>Deduced</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [space, property, trait] ([space.id, property.id])}
      <tr>
        <td>
          <slot {space} {property} />
        </td>
        <td>
          <Link.Trait {space} {property}>
            <Value value={trait.value} />
          </Link.Trait>
        </td>
        <td>
          {#if !trait.asserted}
            <Value value={true} icon="robot" />
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
