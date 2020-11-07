<script lang="ts">
  import context from '../../context'
  import type { Property, Space } from '../../types'

  import { Link, Typeset } from '../Shared'
  import Value from './Value.svelte'

  export let properties: Property[]
  export let spaces: Space[]

  const { traits } = context()
</script>

<table class="table">
  <thead>
    <tr>
      <td />
      {#each properties as { uid, name } (uid)}
        <td>
          <Link to="/properties/{uid}">
            <Typeset body={name} />
          </Link>
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each spaces as space (space.uid)}
      <tr>
        <td>
          <Link to="/spaces/{space.uid}">
            <Typeset body={space.name} />
          </Link>
        </td>
        {#each properties as property (property.uid)}
          <td>
            <Link to="/spaces/{space.uid}/properties/{property.uid}">
              <Value value={$traits.find(space, property)?.value} />
            </Link>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
