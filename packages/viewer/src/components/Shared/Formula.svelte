<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'
  import type { Property } from '../../types'

  import Atom from './Formula/Atom.svelte'
  import Compound from './Formula/Compound.svelte'

  export let value: F.Formula<Property>
  export let link = true
</script>

{#if value.kind === 'atom'}
  <Atom {value} {link} />
{:else}
  <Compound {value} {link} />
{/if}
