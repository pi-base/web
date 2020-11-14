<script lang="ts">
  import { tick } from 'svelte'
  import context from '../../context'

  export let body: string
  export let truncated = false

  const { typeset } = context()

  let html = ''
  $: tick()
    .then(() => $typeset(body, truncated))
    .then((result) => (html = result))
</script>

{#if html}
  {@html html}
{:else if body}{body}{/if}
