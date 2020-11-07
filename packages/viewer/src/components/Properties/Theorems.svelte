<script lang="ts">
  import { Formula, Link, Id } from '../Shared'
  import type { Property } from '../../types'
  import context from '../../context'

  export let property: Property

  const theorems = context().theorems

  $: related = $theorems.forProperty(property)
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
    {#each related as { uid, when, then } (uid)}
      <tr>
        <td>
          <Link to="/properties/{uid}">
            <Id {uid} />
          </Link>
        </td>
        <td>
          <Formula value={when} />
        </td>
        <td>
          <Formula value={then} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
