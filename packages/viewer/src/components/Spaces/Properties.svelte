<script lang="ts">
  import { Link, Id, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import type { Space } from '../../types'
  import context from '../../context'

  export let space: Space

  const { traits } = context()

  // TODO: fuzzy find, sort, toggle deduced
  $: related = $traits.forSpace(space)
</script>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>When</th>
      <th>Then</th>
    </tr>
  </thead>
  <tbody>
    {#each related as [{ uid, name }, { value }] (uid)}
      <tr>
        <td>
          <Link to="/properties/{uid}">
            <Id {uid} />
          </Link>
        </td>
        <td>
          <Typeset body={name} />
        </td>
        <td>
          <Link to="/spaces/{space.uid}/properties/{uid}">
            <Value {value} />
          </Link>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
