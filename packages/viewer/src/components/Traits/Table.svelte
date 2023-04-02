<script lang="ts">
  import context from '../../context'
  import type { Property, Space } from '../../models'

  import { Link } from '../Shared'
  import Value from './Value.svelte'

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
        <td>
          <Link.Property {property} />
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each spaces as space (space.id)}
      <tr>
        <td>
          <Link.Space {space}>{space.id}</Link.Space>
        </td>
        <td>
          <Link.Space {space} />
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
