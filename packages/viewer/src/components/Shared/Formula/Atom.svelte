<script lang="ts">
  import { Link } from 'svelte-routing'
  import type * as F from '@pi-base/core/lib/Formula'

  import Typeset from '../Typeset.svelte'
  import type { Property } from '../../../types'

  export let value: F.Atom<Property>
  export let link: boolean = true
</script>

{value.value ? '' : '¬'}
{#if link}
  <Link to="/properties/{value.property.uid}">
    <Typeset body={value.property.name} />
  </Link>
{:else}
  <Typeset body={value.property.name} />
{/if}
