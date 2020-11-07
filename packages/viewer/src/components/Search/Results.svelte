<script lang="ts">
  import * as F from '@pi-base/core/lib/Formula'

  import { Formula } from '../Shared'
  import { Table } from '../Traits'
  import context from '../../context'
  import { search } from '../../stores'
  import type { Property } from '../../models'

  export let text: string
  export let formula: F.Formula<Property> | undefined

  const { spaces, traits } = context()
  const store = search({ spaces, traits })

  $: results = store.search({ text, formula })
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
