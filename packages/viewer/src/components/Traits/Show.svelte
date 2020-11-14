<script lang="ts">
  import { Link, References, Typeset } from '../Shared'
  import context from '../../context'
  import Proof from './Proof.svelte'

  export let spaceId: string
  export let propertyId: string

  const { spaces, properties, theorems, traits } = context()

  $: space = $spaces.find(spaceId)
  $: property = $properties.find(propertyId)
  $: trait = space && property && $traits.find(space, property)
  $: proof =
    space &&
    trait &&
    !trait.asserted &&
    $traits.proof(space, trait.proof, $theorems)
</script>

{#if space && property && trait}
  <h1>
    <Link.Space {space} />
    is
    {trait.value ? '' : 'not'}
    <Link.Property {property} />
  </h1>

  {#if trait?.asserted}
    <Typeset body={trait.description} />

    <References references={trait.refs} />
  {:else if space && proof}
    <Proof {space} {...proof} />
  {/if}
{/if}
