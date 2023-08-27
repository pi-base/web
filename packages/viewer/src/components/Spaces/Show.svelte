<script lang="ts">
  import type { Space } from 'src/models'
  import { Aliases, Title, Typeset } from '../Shared'

  export let space: Space
</script>

<Title title={space.name} />

<h1>
  <Typeset body={space.name} />
  {#if space?.aliases}
    <Aliases aliases={space.aliases} />
  {/if}
</h1>

<section class="description">
  <Typeset body={space.description} />
</section>
