<script lang="ts">
  import { properties } from '../../context'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'
  import Theorems from './Theorems.svelte'

  export let id: string

  const store = properties()
  $: property = $store.find(id)
</script>

{#if property}
  <Title title={property.name} />

  <h1>
    <Typeset body={property.name} />
    {#if property?.aliases}
      <Aliases aliases={property.aliases} />
    {/if}
  </h1>

  <Typeset body={property.description} />

  <Tabs.Tabs initial="theorems">
    <Tabs.Nav>
      <Tabs.Link to="theorems">Theorems</Tabs.Link>
      <Tabs.Link to="references">References</Tabs.Link>
    </Tabs.Nav>

    <Tabs.Tab path="theorems">
      <Theorems {property} />
    </Tabs.Tab>
    <Tabs.Tab path="references">
      <References references={property.refs} />
    </Tabs.Tab>
  </Tabs.Tabs>
{/if}
