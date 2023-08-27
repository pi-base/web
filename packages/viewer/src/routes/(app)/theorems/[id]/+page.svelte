<script lang="ts">
  import Default from './converse/+page.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Default {data} />
