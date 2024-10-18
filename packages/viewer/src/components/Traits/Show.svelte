<script lang="ts">
  import type { Space, Property, Trait, Proof as ProofT } from '@/models'
  import { Icons, Link, References, Source, Typeset } from '@/components/Shared'
  import Proof from './Proof.svelte'
  export let space: Space
  export let property: Property
  export let trait: Trait | undefined
  export let proof: ProofT | undefined
  export let meta: {
    description: string;
    refs: ({
        name: string;
    } & ({
        doi: string;
    } | {
        wikipedia: string;
    } | {
        mr: string;
    } | {
        mr: number;
    } | {
        mathse: number;
    } | {
        mo: number;
    } | {
        zb: string;
    }))[];
  } | undefined
  import { contributingUrl } from '@/constants'
</script>

<h3>Space S{space.id} | Property P{property.id}</h3>

<h1>
  {#if proof}
    <Icons.Robot />
  {:else if meta}
    <Icons.User />
  {:else}
    <Icons.Question />
  {/if}
  {#if trait}
    <Link.Space {space} />
    is
    {trait.value ? '' : 'not'}
    <Link.Property {property} />
  {:else}
    We have insufficient information to determine whether or not
    <Link.Space {space} />
    is
    <Link.Property {property} />
  {/if}
</h1>

{#if proof}
  <Proof {space} {...proof} />
{:else if meta}
  <section class="description">
    <Typeset body={meta.description} />
  </section>
  <section class="description-markdown">
    <Source source={meta.description} />
  </section>
  <h3>References</h3>
  <References references={meta.refs} />
{:else}
  Please consider <a href={contributingUrl}>contributing</a> a proof or disproof
  of this property.
{/if}
