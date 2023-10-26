<script lang="ts">
  import type { Space } from 'src/models'
  import { Aliases, References, Title, Typeset } from '../Shared'
  import Counterexamples from './Counterexamples.svelte'
  import Properties from './Properties.svelte'
  import { capitalize } from '@/util'

  export let space: Space
  export let tab: 'properties' | 'theorems' | 'references'
  export let rel: string | undefined = undefined
</script>

<Title title={space.name} />

<h1>
  <Typeset body={space.name} />
  {#if space?.aliases}
    <Aliases aliases={space.aliases} />
  {/if}
</h1>

<section class="description">
  <Typeset body={space.description} />
</section>

<ul class="nav nav-tabs">
  {#each ['properties', 'theorems', 'references'] as name}
    <li class="nav-item">
      <a
        class={`nav-link ${name === tab ? 'active' : ''}`}
        href={rel ? `${rel}/${name}` : name}>{capitalize(name)}</a
      >
    </li>
  {/each}
</ul>

{#if tab === 'properties' || !tab}
  <Properties {space} />
{:else if tab === 'theorems'}
  <Counterexamples {space} />
{:else if tab === 'references'}
  <References references={space.refs} />
{/if}
