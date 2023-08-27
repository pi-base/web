<script lang="ts">
  import { derived, type Readable } from 'svelte/store'
  import { list } from '../../stores'

  import { Filter, Formula, Link, Title, Typeset } from '../Shared'
  import type { Theorems } from 'src/models'

  export let theorems: Readable<Theorems>

  const index = list(
    derived(theorems, ts => ts.all),
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
      <th>If</th>
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
