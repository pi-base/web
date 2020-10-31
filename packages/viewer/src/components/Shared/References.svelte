<script lang="ts">
  import type { Ref } from '@pi-base/core'
  import Reference from './Reference.svelte'

  export let references: Ref[]
</script>

<ul>
  {#each references as reference, i (i)}
    <li>
      <Reference {reference} />
    </li>
  {/each}
</ul>
