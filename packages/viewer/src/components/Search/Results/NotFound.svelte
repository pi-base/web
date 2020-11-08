<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'
  import context from '../../../context'
  import { Formula } from '../../Shared'
  import type { Property } from '../../../models'
  import { check } from '../../../stores/deduction'
  import Disprovable from './Disprovable.svelte'

  export let text: string | undefined
  export let formula: F.Formula<Property> | undefined

  const { theorems } = context()

  $: result = formula ? check(theorems, formula) : null
</script>

{#if formula && result}
  <Disprovable {formula} proof={result} />
{:else}
  No spaces found
  {#if text}matching <code>{text}</code>{/if}
  {#if text && formula}and{/if}
  {#if formula}
    satisfying
    <Formula value={formula} />
  {/if}
{/if}
