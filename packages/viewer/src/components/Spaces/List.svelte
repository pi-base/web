<script lang="ts">
  import { Filter, Link, Title, Typeset } from '@/components/Shared'
  import type { Space } from '@/models'
  import type { Store } from '@/stores/list'

  export let spaces: Store<Space>
</script>

<Title title="Spaces" />

<Filter filter={spaces.filter} />

<table class="table">
  <thead>
    <tr>
      <th on:click={spaces.sort('id')}>Id</th>
      <th on:click={spaces.sort('name')}>Name</th>
      <th>Description</th>
    </tr>
  </thead>
  {#each $spaces as space (space.id)}
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
