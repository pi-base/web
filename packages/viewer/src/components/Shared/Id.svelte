<script lang="ts">
  import * as Id from '@pi-base/core/lib/Id'

  export let uid: string
  export let trim = true
</script>

{#if trim}{Id.trim(uid)}{:else}{uid}{/if}
