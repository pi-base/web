<script lang="ts">
  export let value: boolean | 'undecidable' | undefined
  export let icon: 'check' | 'user' = 'check'

  import { Icons } from '../Shared'
</script>

{#if icon === 'user'}
  {#if value === true}
    <Icons.User />
  {:else if value === false}
    <Icons.Robot />
  {:else if value === 'undecidable'}
    <span title="Undecidable">—</span>
  {:else}<!-- value === undefined -->
    <Icons.Question />
  {/if}
{:else}<!-- icon === "check" -->
  {#if value === true}
    <Icons.Check />
  {:else if value === false}
    <Icons.X />
  {:else if value === 'undecidable'}
    <span title="Undecidable">—</span>
  {:else}<!-- value === undefined -->
    <Icons.Question />
  {/if}
{/if}
