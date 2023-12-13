<script lang="ts">
  import { Typeset } from '@/components/Shared'
  import { Id } from '@/models'

  export let property: { id: number; name: string }
  export let content: 'id' | 'idLong' | 'name' = 'name'
</script>

<a href="/properties/{Id.format('P', property.id)}">
  <slot>
    {#if content === 'name'}
      <Typeset body={property.name} />
    {:else if content === 'id'}
      P{property.id}
    {:else}
      {Id.format('P', property.id)}
    {/if}
  </slot>
</a>
