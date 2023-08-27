<script lang="ts">
  import Converse from '../../../../../components/Theorems/Converse.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Converse theorem={data.theorem} />
