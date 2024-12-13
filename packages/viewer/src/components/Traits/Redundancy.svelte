<script lang="ts">
  import { checkNegation } from '@/stores/deduction'
  import context from '@/context'
  import type { Space, Property } from '@/types'
  export let space: Space
  export let property: Property
  const { theorems, traits } = context()
  $: redundant = checkNegation($theorems, space, $traits, property).kind === "contradiction"
</script>

{#if redundant}
  <div class="alert alert-warning">
    This asserted property can be deduced from the other asserted traits for
    this space.
  </div>
{/if}
