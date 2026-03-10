<script lang="ts">
  import Typeset from '@/components/Shared/Typeset.svelte'
  import { Id } from '@/models'

  export let property: { id: number; name: string }
  export let content: 'id' | 'idLong' | 'name' = 'name'
  export let emphasized: boolean = false
</script>

<a
  href="/properties/{Id.format('P', property.id)}"
  class="property-link"
  class:emphasized
>
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

<style>
  .property-link {
    text-decoration: none;
    border: 1px solid #ffffff;
    padding: 0px 5px;
    border-radius: 5px;
    display: inline-block;
  }
  .property-link:hover {
    background-color: #f6fafe;
    border-color: #e0edfb;
  }
  .emphasized {
    border: 1px solid #a8d2ff;
    padding: 0px 5px;
    background-color: #f1f8ff;
  }
  .emphasized:hover {
    background-color: #f6fafe;
    border-color: #e0edfb;
  }
</style>
