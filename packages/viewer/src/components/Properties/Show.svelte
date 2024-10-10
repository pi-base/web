<script lang="ts">
  import type { Property } from '@/models'
  import { Aliases, Link, References, Source, Tabs, Typeset } from '../Shared'
  import Spaces from './Spaces.svelte'
  import Theorems from './Theorems.svelte'

  export let property: Property
  export let tab: 'spaces' | 'theorems' | 'references'
  export let rel: string | undefined = undefined

  const tabs = ['theorems', 'spaces', 'references'] as const
</script>

<h3>Property <Link.Property {property} content="idLong" /></h3>

<h1>
  <Typeset body={property.name} />
</h1>

{#if property.aliases.length > 0}
  <h4 class="text-muted lead">
    Also known as: <Aliases aliases={property.aliases} />
  </h4>
{/if}

<section class="description">
  <Typeset body={property.description} />
</section>

<section class="description-markdown">
  <Source source={property.description} />
</section>

<Tabs {tabs} {tab} {rel} />

{#if tab === 'spaces'}
  <Spaces {property} />
{:else if tab === 'theorems'}
  <Theorems {property} />
{:else if tab === 'references'}
  <References references={property.refs} />
{/if}
