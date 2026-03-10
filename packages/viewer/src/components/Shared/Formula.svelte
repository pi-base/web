<script lang="ts">
  import type { Formula, Property } from '@/models'

  import Atom from './Formula/Atom.svelte'
  import Compound from './Formula/Compound.svelte'

  export let value: Formula<Property>
  export let link = true
  export let subformula = false
  export let emphasizedProperties: Set<Property> = new Set()
</script>

{#if value.kind === 'atom'}<Atom
    {value}
    {link}
    {emphasizedProperties}
  />{:else}<Compound
    {value}
    {link}
    grouped={subformula}
    {emphasizedProperties}
  />{/if}
