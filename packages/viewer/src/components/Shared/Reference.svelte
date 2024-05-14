<script lang="ts">
  import { Ref } from '@pi-base/core'
  import { format } from '@/parser/externalLinks'
  import { Typeset } from '../Shared'

  export let reference: Ref.Ref

  $: value = format(Ref.tag(reference))
</script>

{#if value}
  <a href={value.href}><Typeset body={value.title} /></a>
{:else}Invalid reference: <code>{JSON.stringify(reference)}</code>{/if}
