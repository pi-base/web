<script lang="ts">
  import { properties } from '../../context'

  import { Title, Typeset } from '../Shared'

  export let id: string

  const store = properties()

  const property = $store.find(parseInt(id.slice(1)))
</script>

{#if property}
  <Title title={property.name} />

  <h1>
    <Typeset body={property.name} />
  </h1>

  <Typeset body={property.description} />
{/if}
