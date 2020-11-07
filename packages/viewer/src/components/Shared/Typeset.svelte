<script lang="ts">
  import context from '../../context'
  import { typeset } from '../../stores'

  export let body: string
  export let truncated = false

  const { properties, spaces, theorems } = context()

  $: html = typeset(body, properties, spaces, theorems, truncated)
</script>

{#if body}
  {@html $html}
{/if}
