<script lang="ts">
  export let value: boolean | undefined

  import { Check, Question, X } from '../Shared/Icons'
</script>

{#if value}
  <Check />
{:else if value === undefined}
  <Question />
{:else}
  <X />
{/if}
