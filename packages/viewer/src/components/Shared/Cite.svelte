<script lang="ts">
  import { onMount } from 'svelte'
  import CopyButton from './CopyButton.svelte'
  let url = ''
  let markdown = ''
  export let title: string | undefined = undefined
  onMount(() => {
    url = window.location.href
    markdown = `[${title}](${url})`
  })
</script>

<div class="text-center p-2">
  <small>
    Cite as:
    <span class="text-muted">
      The pi-Base Community.
      {#if title}
        <cite>{title}.</cite>
      {:else}
        <cite>π-Base, a community database of topological counterexamples.</cite
        >
      {/if}
      Available at: {url}
      (Accessed: {new Date().toISOString().split('T')[0]}).
    </span>
  </small>
</div>
<div class="text-center p-2">
  <small>
    Copy:
    <CopyButton text={markdown}>Markdown Link</CopyButton>
  </small>
</div>
