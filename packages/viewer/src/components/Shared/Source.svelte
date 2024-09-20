<script lang="ts">
  export let source: string
  let showMarkdown = false
</script>

<button
  class="btn btn-sm mb-3 {showMarkdown
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  on:click={_ => (showMarkdown = !showMarkdown)}
>
  {#if showMarkdown}Hide{:else}Show{/if} markdown
</button>
{#if showMarkdown}
  <pre>{source}</pre>
{/if}
