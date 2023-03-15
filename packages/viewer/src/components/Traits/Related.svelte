<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { Value } from '../Traits'
  import context from '../../context'
  import type { Property, Space, Trait, Traits } from '../../models'

  export let show: "space"|"property"
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
      {#if showDeduced}
        Showing <Icons.Robot/>
      {:else}
        Hiding <Icons.Robot/>
      {/if}
    </button>
  </div>
</div>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>{#if show==="space"}Space{:else}Property{/if}</th>
      <th>Value</th>
      <th>Source</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [space, property, trait] ([space.id, property.id])}
      <tr>
        {#if show === 'space'}
          <td>
            <Link.Trait {space} {property}>
              {trait.space}
            </Link.Trait>
          </td>
          <td>
            <Link.Trait {space} {property}>
              {space.name}
            </Link.Trait>
          </td>
        {:else}
          <td>
            <Link.Trait {space} {property}>
              {trait.property}
            </Link.Trait>
          </td>
          <td>
            <Link.Trait {space} {property}>
              {property.name}
            </Link.Trait>
          </td>
        {/if}
        <td>
            <Link.Trait {space} {property}>
              <Value value={trait.value} />
            </Link.Trait>
        </td>
        <td>
          <Link.Trait {space} {property}>
            <Value value={trait.asserted} icon="user" />
          </Link.Trait>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
