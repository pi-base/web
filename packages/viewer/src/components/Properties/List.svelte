<script lang="ts">
  import { derived, type Readable } from 'svelte/store'

  import { list } from '@/stores'

  import { Filter, Link, Title, Typeset } from '../Shared'
  import type { Collection, Property } from 'src/models'

  export let properties: Readable<Collection<Property>>

  const index = list(
    derived(properties, ps => ps.all),
    {
      weights: { name: 0.7, aliases: 0.7, description: 0.3 },
      queryParam: 'filter',
    },
  )
</script>

<Title title="Properties" />

<Filter filter={index.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={index.sort('id')}>Id</th>
      <th on:click={index.sort('name')}>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $index as property (property.id)}
    <tr>
      <td>
        <Link.Property {property}>{property.id}</Link.Property>
      </td>
      <td>
        <Typeset body={property.name} />
      </td>
      <td>
        <Typeset body={property.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
