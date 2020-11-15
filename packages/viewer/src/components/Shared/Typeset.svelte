<script lang="ts">
  import context from '../../context'

  export let body: string
  export let truncated = false

  const { typeset } = context()

  let html = ''
  $: setTimeout(
    () => $typeset(body, truncated).then((result) => (html = result)),
    0,
  )
</script>

{#if html}
  {@html html}
{:else if body}{body}{/if}
