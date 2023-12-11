<script lang="ts">
  import { Filter, Link, Title, Typeset } from '@/components/Shared'
  import type { Property } from '@/models'
  import type { Store } from '@/stores/list'

  export let properties: Store<Property>
</script>

<Title title="Properties" />

<Filter filter={properties.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={properties.sort('id')}>Id</th>
      <th on:click={properties.sort('name')}>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $properties as property (property.id)}
    <tr>
      <td>
        <Link.Property {property}>P{property.id}</Link.Property>
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
