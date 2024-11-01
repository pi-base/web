<script lang="ts">
  import { formula as F } from '@pi-base/core'
  import { Formula } from '@/components/Shared'
  import { Table } from '@/components/Traits'
  import type { Property, Space } from '@/models'

  export let text: string | undefined
  export let formula: F.Formula<Property> | undefined
  export let results: Space[]
  let sortedResults: Space[]
  $: if (text !== undefined && text.length > 0) {
    sortedResults = results
  } else {
    sortedResults = results.sort((a, b) => a.id - b.id)
  }
</script>

{results.length} spaces
{#if text}matching <code>{text}</code>{/if}
{#if text && formula}and{/if}
{#if formula}
  satisfying
  <Formula value={formula} />
{/if}

<Table
  spaces={sortedResults}
  properties={formula ? [...F.properties(formula)] : []}
/>
