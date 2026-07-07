<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link } from '../Shared'
  import { ValueIcon, SourceIcon } from '../Traits'
  import context from '@/context'
  import type { Property, Space, Trait, Traits } from '@/models'
  import FilterButtons from './FilterButtons.svelte'
  import { writable } from 'svelte/store'
  import { showRedundancy } from '@/stores/settings'
  import urlSearchParam from '@/stores/urlSearchParam'
  import { checkIfRedundant } from '@/stores/deduction'

  type Row = [Space, Property, Trait | undefined]

  // The entity whose related traits are listed. Passing the entity itself
  // (rather than a closure over it) keeps the data dependency visible to
  // Svelte's reactivity, so the table recomputes when navigating between
  // entities. See https://github.com/pi-base/web/issues/255.
  export let anchor:
    | { mode: 'properties'; space: Space }
    | { mode: 'spaces'; property: Property }

  const { theorems, traits } = context()

  function rows(a: typeof anchor, traits: Traits): Row[] {
    if (a.mode === 'properties') {
      const { space } = a
      return traits.forSpaceAll(space).map(([p, t]) => [space, p, t])
    } else {
      const { property } = a
      return traits.forPropertyAll(property).map(([s, t]) => [s, property, t])
    }
  }

  const filter = writable('')
  urlSearchParam('filter', filter)

  type FilterMode = 'all' | 'known' | 'asserted' | 'true' | 'false' | 'missing'

  let filterMode: FilterMode = 'known'

  function matchesFilter(mode: FilterMode, trait: Trait | undefined): boolean {
    switch (mode) {
      case 'all':
        return true
      case 'known':
        return Boolean(trait)
      case 'asserted':
        return Boolean(trait?.asserted)
      case 'true':
        return Boolean(trait?.value)
      case 'false':
        return Boolean(trait && !trait.value)
      case 'missing':
        return !trait
    }
  }

  $: all = rows(anchor, $traits)
  // we need to index names in different positions depending on which kind we
  // are displaying
  $: index = new Fuse(all, {
    keys: [`${anchor.mode === 'spaces' ? 0 : 1}.name`],
  })
  $: searched = $filter ? index.search($filter).map(r => r.item) : all
  $: filtered = searched.filter(([_space, _property, t]) =>
    matchesFilter(filterMode, t),
  )
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
            <ValueIcon value={trait?.value} />
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
            <SourceIcon
              value={trait?.asserted}
              redundant={$showRedundancy &&
                trait?.asserted &&
                checkIfRedundant(space, property, $theorems, $traits).redundant}
            />
          </Link.Trait>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
