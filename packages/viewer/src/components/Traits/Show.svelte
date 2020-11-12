<script lang="ts">
  import { Link, References, Typeset } from '../Shared'
  import context from '../../context'
  import type { Property, Theorem, Trait } from '../../models'
  import { read } from '../../util'
  import Proof from './Proof.svelte'

  export let space: string
  export let property: string

  const { spaces, properties, theorems, traits } = context()

  // TODO: clean up
  function hydrate(proof: {
    properties: number[]
    theorems: number[]
  }): { traits: [Property, Trait][]; theorems: Theorem[] } {
    const ps = read(properties)
    const trs = read(traits)
    const ths = read(theorems)

    return {
      traits: proof.properties.map((pid) => {
        const p = ps.find(pid)!
        const t = trs.find(s!, p)!
        return [p, t]
      }),
      theorems: proof.theorems.map((p) => ths.find(p)!),
    }
  }

  $: s = $spaces.find(space)
  $: p = $properties.find(property)
  $: t = s && p && $traits.find(s, p)
</script>

{#if s && p && t}
  <h1>
    <Link.Space space={s} />
    is
    {t.value ? '' : 'not'}
    <Link.Property property={p} />
  </h1>

  {#if s && t && t.asserted}
    <Typeset body={t.description} />

    <References references={t.refs} />
  {:else if s && t && !t.asserted}
    <Proof space={s} {...hydrate(t.proof)} />
  {/if}
{/if}
