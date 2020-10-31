<script lang="ts">
  import Typeset from './Typeset.svelte'

  export let aliases: string[]
</script>

{#if aliases.length > 0}
  <small>
    <span class="text-muted">or</span>
    {#each aliases as alias, i (i)}
      <Typeset body={alias} />
      {#if i !== aliases.length - 1}<span class="text-muted comma">,</span>{/if}
    {/each}
  </small>
{/if}
