<script lang="ts">
  import Spaces from '../../../../../components/Properties/Spaces.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Spaces property={data.property} />
