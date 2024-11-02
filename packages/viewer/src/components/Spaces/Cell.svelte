<script lang="ts">
    import type { Space } from '@/models'
    import { Link } from '../Shared'
    import Typeset from '../Shared/Typeset.svelte'
    export let space: Space
</script>

<div><Link.Space {space} /></div>
{#if space.aliases.length > 0}
  <div>
    <small class="text-muted">
      {#each space.aliases as alias, i}
        {#if i > 0}, {/if}
        <Typeset body={alias} />
      {/each}
    </small>
  </div>
{/if}