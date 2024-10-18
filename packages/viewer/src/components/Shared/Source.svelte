<script lang="ts">
  import SeMarkdown from './SeMarkdown.svelte'
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
  <h4>π-Base Markdown</h4>
  <pre>{source}</pre>
  <hr />
  <SeMarkdown {source} />
{/if}
