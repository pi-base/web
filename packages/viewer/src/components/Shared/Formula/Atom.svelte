<script lang="ts">
  import type { Atom } from '@pi-base/core'

  import { Link, Typeset } from '@/components/Shared'
  import type { Property } from '@/models'

  export let value: Atom<Property, null>
  export let link: boolean = true
</script>

{value.value === null ? '?' : value.value ? '' : '¬'}
{#if link}
  <Link.Property property={value.property} />
{:else}
  <Typeset body={value.property.name} />
{/if}
