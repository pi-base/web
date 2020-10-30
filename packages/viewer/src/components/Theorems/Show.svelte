<script lang="ts">
  import { theorems } from '../../context'
  import { Formula, Title, Typeset } from '../Shared'

  export let id: string

  const store = theorems()
  $: theorem = $store.find(id)
</script>

{#if theorem}
  <Title title={theorem.name} />

  <h1>
    <Formula value={theorem.when} />
    ⇒
    <Formula value={theorem.then} />
  </h1>

  <Typeset body={theorem.description} />
{/if}
