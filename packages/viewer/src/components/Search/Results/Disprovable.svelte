<script lang="ts">
  import { Formula } from '../../Shared'
  import { Table as Theorems } from '../../Theorems'
  import type { Formula as F, Property, Theorem } from '../../../models'

  export let formula: F<Property>
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
