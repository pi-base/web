<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'
  import { Formula } from '../../Shared'
  import { Table as Theorems } from '../../Theorems'
  import type { Property, Theorem } from '../../../models'

  export let formula: F.Formula<Property>
  export let proof: Theorem[] | 'tautology'
</script>

{#if proof === 'tautology'}
  <Formula value={formula} />
  is a contradiction
{:else}
  <Formula value={formula} />
  is impossible by

  <Theorems theorems={proof} />
{/if}
