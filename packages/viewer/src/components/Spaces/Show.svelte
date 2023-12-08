<script lang="ts">
  import type { Space } from 'src/models'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'
  import Counterexamples from './Counterexamples.svelte'
  import Properties from './Properties.svelte'

  export let space: Space
  export let tab: 'properties' | 'theorems' | 'references'
  export let rel: string | undefined = undefined

  const title = `S${space.id}: ${space.name}`

  const tabs = ['properties', 'theorems', 'references'] as const
</script>

<Title {title} />

<h3>Space S{space.id}</h3>

<h1>
  <Typeset body={space.name} />
  {#if space?.aliases}
    <Aliases aliases={space.aliases} />
  {/if}
</h1>

<section class="description">
  <Typeset body={space.description} />
</section>

<Tabs {tabs} {tab} {rel} />

{#if tab === 'properties'}
  <Properties {space} />
{:else if tab === 'theorems'}
  <Counterexamples {space} />
{:else if tab === 'references'}
  <References references={space.refs} />
{/if}
