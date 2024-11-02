<script lang="ts">
  import { Filter, Link, Typeset } from '@/components/Shared'
  import type { Space } from '@/models'
  import type { Store } from '@/stores/list'
  import Cell from './Cell.svelte'

  export let spaces: Store<Space>
</script>

<Filter filter={spaces.filter} />

<table class="table">
  <thead>
    <tr>
      <th style="width: 5%" on:click={spaces.sort('id')}>Id</th>
      <th style="width: 35%" on:click={spaces.sort('name')}>Name</th>
      <th style="width: 60%">Description</th>
    </tr>
  </thead>
  {#each $spaces as space (space.id)}
    <tr>
      <td>
        <Link.Space {space} content="id" />
      </td>
      <td>
        <Cell {space} />
      </td>
      <td>
        <Typeset body={space.description} truncated={true} />
      </td>
    </tr>
  {/each}
</table>
