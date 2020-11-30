<script lang="ts">
  import { Ref } from '@pi-base/core'
  import { format } from '../../parser/externalLinks'

  export let reference: Ref.Ref

  $: value = format(Ref.tag(reference))
</script>

{#if value}
  <a href={value.href}>{value.label}</a>
{:else}Invalid reference: <code>{JSON.stringify(reference)}</code>{/if}
