<script lang="ts">
  import { spaces } from '../../context'
  import { Aliases, References, Tabs, Title, Typeset } from '../Shared'

  export let id: string

  const store = spaces()
  $: space = $store.find(id)
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

  <Tabs.Tabs initial="references">
    <Tabs.Nav>
      <Tabs.Link to="references">References</Tabs.Link>
    </Tabs.Nav>

    <Tabs.Tab path="references">
      <References references={space.refs} />
    </Tabs.Tab>
  </Tabs.Tabs>
{/if}
