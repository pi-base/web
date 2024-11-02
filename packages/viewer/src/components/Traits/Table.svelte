<script lang="ts">
  import context from '@/context'
  import type { Property, Space } from '@/models'

  import { Link } from '../Shared'
  import Value from './Value.svelte'
  import Typeset from '../Shared/Typeset.svelte'
  import Cell from '../Spaces/Cell.svelte'

  export let properties: Property[]
  export let spaces: Space[]

  const { traits } = context()
</script>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>Name</th>
      {#each properties as property (property.id)}
        <th>
          <Link.Property {property} />
        </th>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each spaces as space (space.id)}
      <tr>
        <td>
          <Link.Space {space}>S{space.id}</Link.Space>
        </td>
        <td>
          <Cell {space}/>
        </td>
        {#each properties as property (property.id)}
          <td>
            <Link.Trait {space} {property}>
              <Value value={$traits.find(space, property)?.value} />
            </Link.Trait>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
