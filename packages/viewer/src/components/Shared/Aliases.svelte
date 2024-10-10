<script lang="ts">
  import Typeset from './Typeset.svelte'

  export let aliases: string[]
</script>

{#each aliases as alias, i (i)}
  <Typeset body={alias} />{#if i !== aliases.length - 1}<span class="comma"
      >,
    </span>{/if}
{/each}
