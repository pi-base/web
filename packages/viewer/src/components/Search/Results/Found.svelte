<script lang="ts">
  import { formula as F } from '@pi-base/core'
  import { Formula } from '@/components/Shared'
  import { Table } from '@/components/Traits'
  import type { Property, Space } from '@/models'

  export let text: string | undefined
  export let formula: F.Formula<Property> | undefined
  export let results: Space[]
</script>

{results.length} spaces
{#if text}matching <code>{text}</code>{/if}
{#if text && formula}and{/if}
{#if formula}
  satisfying
  <Formula value={formula} />
{/if}

<Table
  spaces={results.sort((a, b) => a.id - b.id)}
  properties={formula ? [...F.properties(formula)] : []}
/>
