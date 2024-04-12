<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { Value } from '../Traits'
  import context from '@/context'
  import type { Property, Space, Trait, Traits } from '@/models'
  import FilterButtons from './FilterButtons.svelte'
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

<div class="d-none d-md-block">
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">
        <Icons.Search />
      </span>
    </div>
    <input
      placeholder="Filter by name"
      class="form-control"
      bind:value={$filter}
    />
    <div class="input-group-append">
      <FilterButtons bind:filterMode />
    </div>
  </div>
</div>
<div class="d-md-none" style="text-align:center">
  <div class="input-group">
    <div class="input-group-prepend">
      <span class="input-group-text">
        <Icons.Search />
      </span>
    </div>
    <input
      placeholder="Filter by name"
      class="form-control"
      bind:value={$filter}
    />
  </div>
  <div class="btn-group" role="group">
    <FilterButtons bind:filterMode />
  </div>
</div>

<table class="table related-traits">
  <thead>
    <tr>
      <th style="width:5%;text-align:center">Value</th>
      <th style="width:5%;text-align:center">Id</th>
      <th style="width:85%">Name</th>
      <th style="width:5%;text-align:center">Source</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [space, property, trait] ([space.id, property.id])}
      <tr>
        <td style="text-align:center">
          <Link.Trait {space} {property}>
            <Value value={trait?.value} />
          </Link.Trait>
        </td>
        <td style="text-align:center">
          <slot name="id" {space} {property} />
        </td>
        <td>
          <slot name="name" {space} {property} />
        </td>
        <td style="text-align:center">
          <Link.Trait {space} {property}>
            <Value value={trait?.asserted} icon="user" />
          </Link.Trait>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
