<script lang="ts">
  import { Link, Id, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import type { Property } from '../../types'
  import context from '../../context'

  export let property: Property

  const { traits } = context()

  // TODO: fuzzy find, sort, toggle deduced
  $: related = $traits.forProperty(property)
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
          <Link to="/spaces/{uid}">
            <Id {uid} />
          </Link>
        </td>
        <td>
          <Typeset body={name} />
        </td>
        <td>
          <Link to="/spaces/{uid}/properties/{property.uid}">
            <Value {value} />
          </Link>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
