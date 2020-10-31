<script lang="ts">
  import * as F from '@pi-base/core/lib/Formula'

  import { Formula, Link, Id } from '../Shared'
  import type { Property } from '../../types'
  import { theorems } from '../../context'

  export let property: Property

  const store = theorems()

  $: related = $store.all.filter(
    ({ when, then }) =>
      F.properties(when).has(property) || F.properties(then).has(property),
  )
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
