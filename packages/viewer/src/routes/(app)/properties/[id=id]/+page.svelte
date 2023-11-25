<script lang="ts">
  import { Show } from '@/components/Properties'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData
</script>

<Show property={data.property} tab="spaces" rel={$page.url.pathname} />
