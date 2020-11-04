<script lang="ts">
  import { Link, References, Typeset } from '../Shared'
  import context from '../../context'

  export let space: string
  export let property: string

  const { spaces, properties, traits } = context()

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

  <Typeset body={t.description} />

  <References references={t.refs} />
{/if}
