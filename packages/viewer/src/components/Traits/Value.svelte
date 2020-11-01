<script lang="ts">
  export let value: boolean

  import { Check, X } from '../Shared/Icons'
</script>

{#if value}
  <Check />
{:else}
  <X />
{/if}
