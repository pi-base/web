<script lang="ts">
  import { properties, spaces, theorems } from '../../context'
  import { typeset } from '../../stores'

  export let body: string
  export let truncated = false

  $: html = typeset(body, properties(), spaces(), theorems(), truncated)
</script>

{#if body}
  {@html $html}
{/if}
