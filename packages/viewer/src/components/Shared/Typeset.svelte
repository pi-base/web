<script lang="ts">
  import context from '../../context'

  export let body: string
  // TODO: export let truncated = false

  const { typeset } = context()

  let html = ''
  $: setTimeout(() => $typeset(body).then((result) => (html = result)), 0)
</script>

{#if body}
  {@html html || body}
{/if}
