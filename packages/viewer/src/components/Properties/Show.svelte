<script lang="ts">
  import type { Property } from 'src/models'
  import {
    Aliases,
    Icons,
    Link,
    References,
    Tabs,
    Title,
    Typeset,
  } from '../Shared'
  import Spaces from './Spaces.svelte'
  import Theorems from './Theorems.svelte'
  import Check from '../Shared/Icons/Check.svelte'

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
  {#if property?.lean}
    <p>
      <Icons.Robot />
      <a href={leanUrl(property.lean)} target="_blank">
        <code>{property.lean.id}</code>
        in
        <code>{property.lean.module}</code>
      </a>
    </p>
  {/if}
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
