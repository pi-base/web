<script lang="ts">
  import type { Theorem } from 'src/models'
  import { Title, Typeset } from '../Shared'
  import Name from './Name.svelte'

  export let theorem: Theorem
</script>

<Title title={theorem.name} />

<h1>
  <Name {theorem} />
</h1>

<section class="description">
  <Typeset body={theorem.description} />
</section>
