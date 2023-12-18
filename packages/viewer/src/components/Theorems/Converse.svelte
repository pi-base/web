<script lang="ts">
  import context from '@/context'
  import { contributingUrl } from '@/constants'
  import type { Space, Theorem } from '@/models'
  import { Table as Traits } from '../Traits'
  import Name from './Name.svelte'
  import Theorems from './Table.svelte'

  export let theorem: Theorem

  const { deduction, spaces, traits } = context()

  $: converse = theorem.converse

  $: counterexamples = $spaces.all.filter((space: Space) =>
    $traits.isCounterexample(converse, space),
  )

  $: proof = deduction.prove(converse)
</script>

<p>
  The converse ( <Name theorem={converse} /> )
  {#if counterexamples.length > 0}
    does not hold, as witnessed by these counterexamples:
    <Traits spaces={counterexamples} properties={theorem.properties} />
  {:else if proof === 'tautology'}
    is tautologicially true
  {:else if proof}
    follows from these theorems:
    <Theorems theorems={proof} />
  {:else}
    cannot be proven from other theorems or disproven from a counterexample.
  {/if}
</p>
{#if counterexamples.length === 0 && !proof}
  <p>
    <a href={contributingUrl}
      >You can learn how to contribute a theorem or counterexample here.</a
    >
  </p>
{/if}
