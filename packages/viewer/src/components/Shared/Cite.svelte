<script lang="ts">
  import { onMount } from 'svelte';
  let url = ``;
  onMount(() => url = window.location.href);
  export let title: string|undefined = undefined;
</script>

<div class="text-center p-2">
  <small>
    Cite as:
    <span class="text-muted">
      The pi-Base Community.
      {#if title}
        <cite>{title}.</cite>
      {:else}
        <cite>π-Base, a community database of topological counterexamples.</cite>
      {/if}
      Available at: {url}
      (Accessed: {new Date().toISOString().split('T')[0]}).
    </span>
  </small>
</div>
