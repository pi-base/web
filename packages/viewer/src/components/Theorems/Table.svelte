<script lang="ts">
  import type { Property, Theorem } from '@/models'
  import { Formula, Link } from '../Shared'
  import type { Readable } from 'svelte/store'

  export let theorems: Theorem[] = []
  export let small = false
  export let selected: Readable<Theorem | Property> | undefined = undefined
</script>

<table class="table" class:table-sm={small}>
  <thead>
    <tr>
      <th>Id</th>
      <th>If</th>
      <th>Then</th>
    </tr>
  </thead>
  <tbody>
    {#each theorems as theorem (theorem.id)}
      <tr class:table-warning={$selected === theorem}>
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
