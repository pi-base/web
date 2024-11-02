<script lang="ts">
    import type { Property } from '@/models'
    import { Link } from '../Shared'
    import Typeset from '../Shared/Typeset.svelte'
    export let property: Property
</script>

<div><Link.Property {property} /></div>
{#if property.aliases.length > 0}
  <div>
    <small class="text-muted">
      {#each property.aliases as alias, i}
        {#if i > 0}, {/if}
        <Typeset body={alias} />
      {/each}
    </small>
  </div>
{/if}