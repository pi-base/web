<script lang="ts">
  import { Link, References, Typeset } from '../Shared'
  import context from '../../context'
  import { idToInt } from '../../util'

  export let space: string
  export let property: string

  const { spaces, properties, traits } = context()

  $: s = $spaces.find(idToInt(space))
  $: p = $properties.find(idToInt(property))
  $: t = $traits.find(`${idToInt(space)}.${idToInt(property)}`)
</script>

{#if s && p && t}
  <h1>
    <Link to="/spaces/{s.uid}">
      <Typeset body={s.name} />
    </Link>
    is
    {t.value || 'not'}
    <Link to="/properties/{p.uid}">
      <Typeset body={p.name} />
    </Link>
  </h1>

  <Typeset body={t.description} />

  <References references={t.refs} />
{/if}
