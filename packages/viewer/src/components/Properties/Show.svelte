<script lang="ts">
  import type { Property } from 'src/models'
  import { Aliases, Title, Typeset } from '../Shared'

  export let property: Property
</script>

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
