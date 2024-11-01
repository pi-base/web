<script lang="ts">
  import type { Theorem } from '@/models'
  import { Link, References, Tabs, Source, Typeset } from '../Shared'
  import Name from './Name.svelte'
  import Converse from './Converse.svelte'

  export let theorem: Theorem
  export let tab: 'converse' | 'references'
  export let rel: string | undefined = undefined

  const tabs = ['converse', 'references'] as const
</script>

<h3>Theorem <Link.Theorem {theorem} content="idLong" /></h3>

<h1>
  <Name {theorem} />
</h1>

<section class="description">
  <Typeset body={theorem.description} />
</section>

<section class="description-markdown">
  <Source source={theorem.description} internal external />
</section>

<Tabs {tabs} {tab} {rel} />

{#if tab === 'converse'}
  <Converse {theorem} />
{:else if tab === 'references'}
  <References references={theorem.refs} />
{/if}
