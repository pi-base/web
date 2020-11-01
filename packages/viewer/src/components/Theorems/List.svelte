<script lang="ts">
  import { derived } from 'svelte/store'
  import { theorems } from '../../context'
  import { list } from '../../stores'

  import { Filter, Formula, Id, Link, Title, Typeset } from '../Shared'

  const index = list(
    derived(theorems(), (ts) => ts.all),
    {
      weights: { name: 0.7, description: 0.3 },
      queryParam: 'filter',
    },
  )
</script>

<Title title="Theorems" />

<Filter filter={index.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={index.sort('uid')}>Id</th>
      <th>When</th>
      <th>Then</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $index as { uid, when, then, description } (uid)}
    <tr>
      <td>
        <Link to="/theorems/{uid}">
          <Id {uid} />
        </Link>
      </td>
      <td>
        <Formula value={when} />
      </td>
      <td>
        <Formula value={then} />
      </td>
      <td>
        <Typeset body={description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
