<script lang="ts">
  import { Filter, Link, Typeset } from '@/components/Shared'
  import type { Property } from '@/models'
  import type { Store } from '@/stores/list'
  import Cell from './Cell.svelte'

  export let properties: Store<Property>
</script>

<Filter filter={properties.filter} />

<table class="table">
  <thead>
    <tr>
      <th style="width: 5%" on:click={properties.sort('id')}>Id</th>
      <th style="width: 25%" on:click={properties.sort('name')}>Name</th>
      <th style="width: 70%">Description</th>
    </tr>
  </thead>
  {#each $properties as property (property.id)}
    <tr>
      <td>
        <Link.Property {property} content="id" />
      </td>
      <td>
        <Cell {property} />
      </td>
      <td>
        <Typeset body={property.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
