<script lang="ts">
  import context from '@/context'
  import type { Space } from '@/models'
  import { Typeset } from '../Shared'
  import { Table } from '../Theorems'

  export let space: Space

  const { theorems, traits } = context()

  $: results = $theorems.all.filter(t =>
    $traits.isCounterexample(t.converse, space),
  )
</script>

<Typeset body={space.name} />
is a counterexample to the converse of
{results.length}
theorems

{#if results.length > 0}
  <Table theorems={results} />
{/if}
