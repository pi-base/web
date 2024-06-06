<script lang="ts">
  export let title: string
</script>

<svelte:head>
  {#key title}
    {#if title}
      <title>{title} | π-Base</title>
    {:else}
      <title>π-Base</title>
    {/if}
  {/key}
</svelte:head>
