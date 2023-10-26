<script lang="ts">
  import type { Formula, Property } from '@/models'

  import Atom from './Formula/Atom.svelte'
  import Compound from './Formula/Compound.svelte'

  export let value: Formula<Property>
  export let link = true
</script>

{#if value.kind === 'atom'}
  <Atom {value} {link} />
{:else}
  <Compound {value} {link} />
{/if}
