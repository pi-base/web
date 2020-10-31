<script lang="ts">
  import type { Ref } from '@pi-base/core'
  import { tag } from '@pi-base/core/lib/Ref'
  import { format } from '../../parser/externalLinks'

  export let reference: Ref

  $: value = format(tag(reference))
</script>

{#if value}
  <a href={value.href}>{value.label}</a>
{:else}Invalid reference: <code>{JSON.stringify(reference)}</code>{/if}
