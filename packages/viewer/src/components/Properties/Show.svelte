<script lang="ts">
  import type { Property } from 'src/models'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'
  import Spaces from './Spaces.svelte'
  import Theorems from './Theorems.svelte'

  export let property: Property
  export let tab: 'spaces' | 'theorems' | 'references'
  export let rel: string | undefined = undefined

  $: title = `P${property.id}: ${property.name}`

  const tabs = ['spaces', 'theorems', 'references'] as const
</script>

<Title {title} />

<h3>Property P{property.id}</h3>

<h1>
  <Typeset body={property.name} />
  {#if property?.aliases}
    <Aliases aliases={property.aliases} />
  {/if}
</h1>

<section class="description">
  <Typeset body={property.description} />
</section>

<Tabs {tabs} {tab} {rel} />

{#if tab === 'spaces'}
  <Spaces {property} />
{:else if tab === 'theorems'}
  <Theorems {property} />
{:else if tab === 'references'}
  <References references={property.refs} />
{/if}
