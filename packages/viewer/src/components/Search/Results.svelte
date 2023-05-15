<script lang="ts">
  import context from '../../context'
  import { search } from '../../stores'
  import type { Formula, Property, Space } from '../../models'
  import Found from './Results/Found.svelte'
  import NotFound from './Results/NotFound.svelte'

  export let text: string
  export let formula: Formula<Property> | undefined

  const { spaces, traits } = context()
  const store = search({ spaces, traits })

  let results: Space[]
  store.subscribe(r => (results = r))

  $: store.search({ text, formula })
</script>

{#if results.length > 0}
  <Found {text} {formula} {results} />
{:else}
  <NotFound {text} {formula} />
{/if}
