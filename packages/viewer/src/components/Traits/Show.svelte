<script lang="ts">
  import { get } from 'svelte/store'
  import {
    Loading,
    Link,
    NotFound,
    References,
    Title,
    Typeset,
  } from '../Shared'
  import context from '@/context'
  import Proof from './Proof.svelte'
  import { Robot } from '../Shared/Icons'

  export let spaceId: string
  export let propertyId: string

  const { spaces, properties, theorems, traits, load, checked } = context()

  const loading = load(
    traits,
    ts =>
      ts.lookup({
        spaceId,
        propertyId,
        spaces: get(spaces),
        properties: get(properties),
        theorems: get(theorems),
      }),
    checked(spaceId),
  )
</script>

{#await loading}
  <Loading />
{:then { property, space, trait, proof, meta }}
  <Title title={`${space.name}: ${property.name}`} />

  <h3>Property P{property.id} | Space S{space.id}</h3>

  <h1>
    {#if proof}
      <Robot />
    {/if}
    <Link.Space {space} />
    is
    {trait.value ? '' : 'not'}
    <Link.Property {property} />
  </h1>

  {#if proof}
    <Proof {space} {...proof} />
  {:else if meta}
    <section class="description">
      <Typeset body={meta.description} />
    </section>
    <h3>References</h3>
    <References references={meta.refs} />
  {/if}
{:catch}
  <NotFound>Could not find space {spaceId} / property {propertyId}</NotFound>
{/await}
