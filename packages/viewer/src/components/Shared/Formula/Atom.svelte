<script lang="ts">
  import type { Atom } from '@pi-base/core'

  import { Link, Typeset } from '@/components/Shared'
  import type { Property } from '@/models'

  export let value: Atom<Property>
  export let link: boolean = true
  export let emphasizedProperties: Set<Property> = new Set()
  $: emphasized = emphasizedProperties.has(value.property)
</script>

{value.value === null ? '?' : value.value ? '' : '¬'}{#if link}<Link.Property
    property={value.property}
    {emphasized}
  />{:else}<Typeset body={value.property.name} />{/if}
