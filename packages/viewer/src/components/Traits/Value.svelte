<script lang="ts">
  export let value: boolean | undefined
  export let icon: 'check' | 'user' = 'check'

  import { Icons } from '../Shared'
</script>

{#if value}
  {#if icon === 'user'}
    <Icons.User />
  {:else}
    <Icons.Check />
  {/if}
{:else if value === false}
  {#if icon === 'user'}
    <Icons.Robot />
  {:else}
    <Icons.X />
  {/if}
{:else}<!-- value === undefined -->
  <Icons.Question />
{/if}
