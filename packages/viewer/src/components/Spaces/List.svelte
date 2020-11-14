<script lang="ts">
  import { derived } from 'svelte/store'

  import context from '../../context'
  import { list } from '../../stores'

  import { Filter, Link, Title, Typeset } from '../Shared'

  const index = list(
    derived(context().spaces, (ss) => ss.all),
    {
      weights: { name: 0.7, aliases: 0.7, description: 0.3 },
      queryParam: 'filter',
    },
  )
</script>

<Title title="Spaces" />

<Filter filter={index.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={index.sort('id')}>Id</th>
      <th on:click={index.sort('name')}>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $index as space (space.id)}
    <tr>
      <td>
        <Link.Space {space}>{space.id}</Link.Space>
      </td>
      <td>
        <Typeset body={space.name} />
      </td>
      <td>
        <Typeset body={space.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
