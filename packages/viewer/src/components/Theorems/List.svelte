<script lang="ts">
  import { Filter, Formula, Link, Title, Typeset } from '../Shared'
  import type { Theorem } from '@/models'
  import type { Store } from '@/stores/list'

  export let theorems: Store<Theorem>
</script>

<Title title="Theorems" />

<Filter filter={theorems.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={theorems.sort('id')}>Id</th>
      <th>If</th>
      <th>Then</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $theorems as theorem (theorem.id)}
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
