<script lang="ts">
  import type { Theorem, Property } from '@/models'
  import { Formula, Link } from '../Shared'

  export let theorems: Theorem[] = []
  export let emphasizedProperties: Set<Property> = new Set()
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
          <Formula value={theorem.when} {emphasizedProperties} />
        </td>
        <td>
          <Formula value={theorem.then} {emphasizedProperties} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
