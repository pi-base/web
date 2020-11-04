<script lang="ts">
  import { theorems } from '../../context'
  import { References, Tabs, Title, Typeset } from '../Shared'
  import Converse from './Converse.svelte'
  import Name from './Name.svelte'

  export let id: string

  const store = theorems()
  $: theorem = $store.find(id)
</script>

{#if theorem}
  <Title title={theorem.name} />

  <h1>
    <Name {theorem} />
  </h1>

  <Typeset body={theorem.description} />

  <Tabs.Tabs initial="converse">
    <Tabs.Nav>
      <Tabs.Link to="converse">Converse</Tabs.Link>
      <Tabs.Link to="references">References</Tabs.Link>
    </Tabs.Nav>

    <Tabs.Tab path="converse">
      <Converse {theorem} />
    </Tabs.Tab>
    <Tabs.Tab path="references">
      <References references={theorem.refs} />
    </Tabs.Tab>
  </Tabs.Tabs>
{/if}
