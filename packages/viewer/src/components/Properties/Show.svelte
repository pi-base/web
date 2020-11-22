<script lang="ts">
  import context from '../../context'
  import {
    Aliases,
    Loading,
    NotFound,
    References,
    Tabs,
    Title,
    Typeset,
  } from '../Shared'
  import Spaces from './Spaces.svelte'
  import Theorems from './Theorems.svelte'

  export let id: string

  const ctx = context()
  const load = ctx.load(ctx.properties, (p) => p.find(id))
</script>

{#await load}
  <Loading />
{:then property}
  <Title title={property.name} />

  <h1>
    <Typeset body={property.name} />
    {#if property?.aliases}
      <Aliases aliases={property.aliases} />
    {/if}
  </h1>

  <section class="description">
    <Typeset body={property.description} />
  </section>

  <Tabs.Tabs initial="spaces">
    <Tabs.Nav>
      <Tabs.Link to="spaces">Spaces</Tabs.Link>
      <Tabs.Link to="theorems">Theorems</Tabs.Link>
      <Tabs.Link to="references">References</Tabs.Link>
    </Tabs.Nav>

    <Tabs.Tab path="spaces">
      <Spaces {property} />
    </Tabs.Tab>
    <Tabs.Tab path="theorems">
      <Theorems {property} />
    </Tabs.Tab>
    <Tabs.Tab path="references">
      <References references={property.refs} />
    </Tabs.Tab>
  </Tabs.Tabs>
{:catch}
  <NotFound>Could not find property {id}</NotFound>
{/await}
