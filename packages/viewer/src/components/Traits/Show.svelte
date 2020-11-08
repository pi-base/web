<script lang="ts">
  import { Link, References, Typeset } from '../Shared'
  import context from '../../context'
  import type { Property, Theorem } from '../../models'
  import { read } from '../../util'
  import Proof from './Proof.svelte'

  export let space: string
  export let property: string

  const { spaces, properties, theorems, traits } = context()

  // TODO: clean up
  function hydrate(proof: { properties: string[]; theorems: string[] }) {
    const ps = read(properties)
    const trs = read(traits)
    const ths = read(theorems)

    return {
      traits: proof.properties.map((pid) => {
        const p = ps.find(pid)!
        const t = trs.find(s!, p)!
        return { pid, name: p.name, value: t.value, deduced: !!t.proof }
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
    <Link to="/spaces/{s.uid}">
      <Typeset body={s.name} />
    </Link>
    is
    {t.value ? '' : 'not'}
    <Link to="/properties/{p.uid}">
      <Typeset body={p.name} />
    </Link>
  </h1>

  {#if s && t && t.proof}
    <Proof space={s} {...hydrate(t.proof)} />
  {:else if t}
    <Typeset body={t.description} />

    <References references={t.refs} />
  {/if}
{/if}
