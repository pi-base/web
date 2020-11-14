<script lang="ts">
  import { derived } from 'svelte/store'
  import context from '../../context'
  import { list } from '../../stores'

  import { Filter, Formula, Link, Title, Typeset } from '../Shared'

  const index = list(
    derived(context().theorems, (ts) => ts.all),
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
      <th on:click={index.sort('id')}>Id</th>
      <th>When</th>
      <th>Then</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $index as theorem (theorem.id)}
    <tr>
      <td>
        <Link.Theorem {theorem} />
      </td>
      <td>
        <Formula value={theorem.when} />
      </td>
      <td>
        <Formula value={theorem.then} />
      </td>
      <td>
        <Typeset body={theorem.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
