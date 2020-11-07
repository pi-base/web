<script lang="ts">
  import context from '../../context'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'
  import Counterexamples from './Counterexamples.svelte'
  import Properties from './Properties.svelte'

  export let id: string

  const { spaces } = context()
  $: space = $spaces.find(id)
</script>

{#if space}
  <Title title={space.name} />

  <h1>
    <Typeset body={space.name} />
    {#if space?.aliases}
      <Aliases aliases={space.aliases} />
    {/if}
  </h1>

  <Typeset body={space.description} />

  <Tabs.Tabs initial="theorems">
    <Tabs.Nav>
      <Tabs.Link to="theorems">Theorems</Tabs.Link>
      <Tabs.Link to="properties">Properties</Tabs.Link>
      <Tabs.Link to="references">References</Tabs.Link>
    </Tabs.Nav>

    <Tabs.Tab path="theorems">
      <Counterexamples {space} />
    </Tabs.Tab>
    <Tabs.Tab path="properties">
      <Properties {space} />
    </Tabs.Tab>
    <Tabs.Tab path="references">
      <References references={space.refs} />
    </Tabs.Tab>
  </Tabs.Tabs>
{/if}
