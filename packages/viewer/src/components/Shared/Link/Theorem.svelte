<script lang="ts">
  import { Id } from '@/models'

  export let theorem: { id: number }
  export let content: 'id' | 'idLong' = 'id'
</script>

<a href="/theorems/{Id.format('T', theorem.id)}">
  <slot>
    {#if content === 'id'}
      T{theorem.id}
    {:else}
      {Id.format('T', theorem.id)}
    {/if}
  </slot>
</a>
