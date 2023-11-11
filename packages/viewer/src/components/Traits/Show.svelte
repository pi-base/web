<script lang="ts">
  import Proof from './Proof.svelte'
  import { Link, References, Title, Typeset } from '../Shared'
  import type {
    Proof as ProofData,
    Property,
    Ref,
    Space,
    Trait,
  } from '@/models'

  export let space: Space
  export let property: Property
  export let trait: Trait
  export let proof: ProofData | undefined
  export let meta: { description: string; refs: Ref[] } | undefined
</script>

<Title title={`${space.name}: ${property.name}`} />

<h1>
  <Link.Space {space} />
  is
  {trait.value ? '' : 'not'}
  <Link.Property {property} />
</h1>

{#if proof}
  <Proof {space} {property} {...proof} />
{:else if meta}
  <section class="description">
    <Typeset body={meta.description} />
  </section>
  <h3>References</h3>
  <References references={meta.refs} />
{/if}
