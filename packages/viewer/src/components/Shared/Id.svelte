<script lang="ts">
  import { Id } from '../../models'

  export let uid: string
  export let trim = true
</script>

{#if trim}{Id.trim(uid)}{:else}{uid}{/if}
