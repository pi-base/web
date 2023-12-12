<script lang="ts">
  import type { Theorem } from '@/models'
  import { Formula, Link } from '../Shared'

  export let theorems: Theorem[] = []
</script>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>If</th>
      <th>Then</th>
    </tr>
  </thead>
  <tbody>
    {#each theorems as theorem (theorem.id)}
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
      </tr>
    {/each}
  </tbody>
</table>
