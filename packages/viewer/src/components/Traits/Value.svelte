<script lang="ts">
  export let value: boolean | undefined
  export let icon: 'check' | 'user' = 'check'

  import { Check, Question, X, Robot, User } from '../Shared/Icons'
</script>

{#if value}
  {#if icon === 'user'}
    <User />
  {:else}
    <Check />
  {/if}
{:else if value === false}
  {#if icon === 'user'}
    <Robot />
  {:else}
    <X />
  {/if}
{:else}<!-- value === undefined -->
  <Question />
{/if}
