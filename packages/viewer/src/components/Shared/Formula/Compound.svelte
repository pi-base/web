<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'

  import type { Property } from '../../../models'

  import Formula from '../Formula.svelte'

  export let value: F.And<Property> | F.Or<Property>
  export let link = true

  $: connector = value.kind === 'and' ? '∧' : '∨'
</script>

{#each value.subs as f, i}
  <Formula value={f} {link} />
  {i === value.subs.length - 1 ? '' : connector}
{/each}
