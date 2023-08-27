<script lang="ts">
  import Default from './spaces/+page.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Default {data} />
