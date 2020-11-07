<script lang="ts">
  import context from '../../context'
  import type { Space, Theorem } from '../../models'
  import { Table } from '../Traits'
  import Name from './Name.svelte'

  export let theorem: Theorem

  const { spaces, traits } = context()

  $: counterexamples = $spaces.all.filter((space: Space) =>
    $traits.isCounterexample(theorem.converse, space),
  )
</script>

{#if counterexamples.length > 0}
  The converse (
  <Name theorem={theorem.converse} />
  ) does not hold, as witnessed by

  <Table spaces={counterexamples} properties={theorem.properties} />
{/if}
<!-- TODO: deducable theorem, recorded theorem, unknown -->
