<script lang="ts">
  import type { Property } from 'src/models'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'
  import Spaces from './Spaces.svelte'
  import Theorems from './Theorems.svelte'

  export let property: Property
  export let tab: 'spaces' | 'theorems' | 'references'
  export let rel: string | undefined = undefined

  const tabs = ['spaces', 'theorems', 'references'] as const

  function leanUrl({ id, module }: { id: string; module: string }) {
    const path = module.replaceAll('.', '/')
    return `https://leanprover-community.github.io/mathlib4_docs/${path}.html#${id}`
  }
</script>

<Title title={property.name} />

<h1>
  <Typeset body={property.name} />
  {#if property?.aliases}
    <Aliases aliases={property.aliases} />
  {/if}
</h1>

<section class="description">
  <Typeset body={property.description} />
</section>

{#if property?.lean}
  <section>
    <a href={leanUrl(property.lean)} target="_blank">
      Formalized in Lean as <code>{property.lean.id}</code>
      in
      <code>{property.lean.module}</code>
    </a>
  </section>
{/if}

<Tabs {tabs} {tab} {rel} />

{#if tab === 'spaces'}
  <Spaces {property} />
{:else if tab === 'theorems'}
  <Theorems {property} />
{:else if tab === 'references'}
  <References references={property.refs} />
{/if}
