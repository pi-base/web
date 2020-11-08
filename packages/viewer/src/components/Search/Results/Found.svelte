<script lang="ts">
  import * as F from '@pi-base/core/lib/Formula'
  import { Formula } from '../../Shared'
  import { Table } from '../../Traits'
  import type { Property, Space } from '../../../models'

  export let text: string | undefined
  export let formula: F.Formula<Property> | undefined
  export let results: Space[]
</script>

Spaces
{#if text}matching <code>{text}</code>{/if}
{#if text && formula}and{/if}
{#if formula}
  satisfying
  <Formula value={formula} />
{/if}

<Table
  spaces={results}
  properties={formula ? [...F.properties(formula)] : []} />
