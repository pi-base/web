<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'

  import Link from '../Link'
  import Typeset from '../Typeset.svelte'
  import type { Property } from '../../../models'

  export let value: F.Atom<Property>
  export let link: boolean = true
</script>

{value.value ? '' : '¬'}
{#if link}
  <Link.Property property={value.property} />
{:else}
  <Typeset body={value.property.name} />
{/if}
