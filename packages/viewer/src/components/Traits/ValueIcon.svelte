<script lang="ts">
  export let value: boolean | undefined
  import { Icons } from '../Shared'
</script>

{#if value === true}
  <Icons.Check />
{:else if value === false}
  <Icons.X />
{:else}<!-- value === undefined -->
  <Icons.Question />
{/if}
