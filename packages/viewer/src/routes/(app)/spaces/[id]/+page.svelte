<script lang="ts">
  import { Show } from '@/components/Spaces'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData
  let rel = $page.url.pathname
</script>

<Show space={data.space} tab="properties" {rel} />
