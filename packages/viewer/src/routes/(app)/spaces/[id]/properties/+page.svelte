<script lang="ts">
  import Properties from '../../../../../components/Spaces/Properties.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Properties space={data.space} />
