<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'
  import context from '../../context'
  import { search } from '../../stores'
  import type { Property } from '../../models'
  import Found from './Results/Found.svelte'
  import NotFound from './Results/NotFound.svelte'

  export let text: string
  export let formula: F.Formula<Property> | undefined

  const { spaces, traits } = context()
  const store = search({ spaces, traits })

  $: results = store.search({ text, formula })
</script>

{#if results.length > 0}
  <Found {text} {formula} {results} />
{:else}
  <NotFound {text} {formula} />
{/if}
