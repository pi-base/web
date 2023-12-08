<script lang="ts">
  import type { Theorem } from 'src/models'
  import { References, Tabs, Title, Typeset } from '../Shared'
  import Name from './Name.svelte'
  import Converse from './Converse.svelte'

  export let theorem: Theorem
  export let tab: 'converse' | 'references'
  export let rel: string | undefined = undefined

  const title = `T${theorem.id}: ${theorem.name}`

  const tabs = ['converse', 'references'] as const
</script>

<Title {title} />

<h3>Theorem T{theorem.id}</h3>

<h1>
  <Name {theorem} />
</h1>

<section class="description">
  <Typeset body={theorem.description} />
</section>

<Tabs {tabs} {tab} {rel} />

{#if tab === 'converse'}
  <Converse {theorem} />
{:else if tab === 'references'}
  <References references={theorem.refs} />
{/if}
