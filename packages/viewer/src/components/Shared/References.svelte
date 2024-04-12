<script lang="ts">
  import type { Ref } from '@pi-base/core'
  import Reference from './Reference.svelte'
  import { contributingUrl } from '@/constants'

  export let references: Ref.Ref[]
</script>

<ul class="references">
  {#each references as reference, i (i)}
    <li>
      <Reference {reference} />
    </li>
  {:else}
    <li>
      No references available. If appropriate,
      please consider <a href={contributingUrl}>contributing</a> a
      reference.
    </li>
  {/each}
</ul>
