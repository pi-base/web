<script lang="ts">
  import context from '@/context'
  import { Formula } from '@/components/Shared'
  import type { Formula as F, Property } from '@/models'
  import { disprove } from '@/stores/deduction'
  import Disprovable from './Disprovable.svelte'

  export let text: string | undefined
  export let formula: F<Property> | undefined

  const { theorems } = context()

  $: proof = formula ? disprove(theorems, formula) : null
</script>

{#if formula && proof}
  <Disprovable {formula} {proof} />
{:else}
  No spaces found
  {#if text}matching <code>{text}</code>{/if}
  {#if text && formula}and{/if}
  {#if formula}
    satisfying
    <Formula value={formula} />
  {/if}
{/if}
