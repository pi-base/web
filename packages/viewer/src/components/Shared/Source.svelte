<script lang="ts">
  import ExtMarkdown from './ExtMarkdown.svelte'
  export let source: string
  let showMarkdown = false
  export let internal = false
  export let external = false
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
  {#if internal}
  <h4>π-Base Markdown</h4>
  <pre>{source}</pre>
  <hr />
  {/if}
  {#if external}
  <ExtMarkdown {source} />
  {/if}
{/if}
