<script lang="ts">
  export let source: string
  let showMarkdown = false
</script>

<button
  class="btn btn-secondary btn-sm mb-3"
  on:click={_ => (showMarkdown = !showMarkdown)}
>
  {#if showMarkdown}Hide{:else}Show{/if} markdown
</button>
{#if showMarkdown}
  <pre>{source}</pre>
{/if}
