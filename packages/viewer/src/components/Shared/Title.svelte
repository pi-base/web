<script lang="ts">
  export let title: string
</script>

<svelte:head>
  {#if title}
    <title>{title} | π-Base</title>
  {:else}
    <title>π-Base</title>
  {/if}
</svelte:head>
