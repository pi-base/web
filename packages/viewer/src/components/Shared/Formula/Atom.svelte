<script lang="ts">
  import type { Atom } from '@pi-base/core'

  import Link from '../Link'
  import Typeset from '../Typeset.svelte'
  import type { Property } from '../../../models'

  export let value: Atom<Property>
  export let link: boolean = true
</script>

{value.value ? '' : '¬'}
{#if link}
  <Link.Property property={value.property} />
{:else}
  <Typeset body={value.property.name} />
{/if}
