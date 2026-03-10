<script lang="ts">
  export let value: boolean | undefined
  export let redundant: boolean = false
  import { Icons } from '../Shared'
</script>

{#if value === true}
  <Icons.User />{#if redundant}*{/if}
{:else if value === false}
  <Icons.Robot />
{:else}<!-- value === undefined -->
  <Icons.Question />
{/if}
