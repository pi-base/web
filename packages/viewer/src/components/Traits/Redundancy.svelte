<script lang="ts">
  import { checkNegation } from '@/stores/deduction'
  import context from '@/context'
  import type { Space, Property } from '@/types'
  import type { Theorem } from '@/models'
  import Table from '../Theorems/Table.svelte'
  export let space: Space
  export let property: Property
  const { theorems, traits } = context()
  $: result = checkNegation($theorems, space, $traits, property)
  let thms: Theorem[]
  $: if (result.kind === 'contradiction') {
    thms = result.contradiction.theorems
      .map(i => $theorems.find(i))
      .filter(t => t !== null)
  }
</script>

{#if result.kind === 'contradiction'}
  <div class="alert alert-warning">
    <strong>Notice:</strong>
    This asserted property can be deduced from the other asserted traits for
    this space.
  </div>
  <Table theorems={thms} />
{/if}
