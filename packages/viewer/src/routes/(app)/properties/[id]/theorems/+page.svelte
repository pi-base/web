<script lang="ts">
  import Theorems from '../../../../../components/Properties/Theorems.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Theorems property={data.property} />
