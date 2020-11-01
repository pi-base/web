<script lang="ts">
  import { derived } from 'svelte/store'

  import { spaces } from '../../context'
  import { list } from '../../stores'

  import { Filter, Id, Link, Title, Typeset } from '../Shared'

  const index = list(
    derived(spaces(), (ss) => ss.all),
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
      <th on:click={index.sort('uid')}>Id</th>
      <th on:click={index.sort('name')}>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $index as { uid, name, description } (uid)}
    <tr>
      <td>
        <Link to="/spaces/{uid}">
          <Id {uid} />
        </Link>
      </td>
      <td>
        <Typeset body={name} />
      </td>
      <td>
        <Typeset body={description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
