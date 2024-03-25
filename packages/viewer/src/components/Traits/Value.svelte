<script lang="ts">
  export let value: boolean | undefined
  export let icon: 'check' | 'user' = 'check'

  import { Icons } from '../Shared'
</script>

{#if icon === 'user'}
  {#if value === true}
    <Icons.User />
  {:else if value === false}
    <Icons.Robot />
  {:else}<!-- value === undefined -->
    <Icons.Question />
  {/if}
{:else}<!-- icon === "check" -->
  {#if value === true}
    <Icons.Check />
  {:else if value === false}
    <Icons.X />
  {:else}<!-- value === undefined -->
    <Icons.Question />
  {/if}
{/if}
