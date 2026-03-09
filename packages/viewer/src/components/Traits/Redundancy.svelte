<script lang="ts">
  import { checkIfRedundant } from '@/stores/deduction'
  import context from '@/context'
  import type { Space, Property } from '@/types'
  import Table from '../Theorems/Table.svelte'
  export let space: Space
  export let property: Property
  const { theorems, traits } = context()
  let result = checkIfRedundant(space, property, $theorems, $traits)
  $: emphasizedProperties = new Set(
    $traits
      .forSpace(space)
      .filter(([_, t]) => t.asserted)
      .map(([p, _]) => p),
  )
</script>

{#if result.redundant}
  <div class="alert alert-warning">
    <strong>Notice:</strong>
    This asserted property can be deduced from the other asserted traits for this
    space, due to the following theorems.
  </div>
  <Table theorems={result.theorems} {emphasizedProperties} />
{/if}
