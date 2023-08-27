<script lang="ts">
  import Default from './properties/+page.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Default {data} />
