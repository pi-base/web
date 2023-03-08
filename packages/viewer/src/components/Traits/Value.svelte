<script lang="ts">
  export let value: boolean | undefined
  export let icon: "check" | "robot" = "check"

  import { Check, Question, X, Robot } from '../Shared/Icons'
</script>

{#if value}
  {#if icon === "robot"}
    <Robot />
  {:else}
    <Check />
  {/if}
{:else if value === undefined}
  <Question />
{:else}
  <X />
{/if}
