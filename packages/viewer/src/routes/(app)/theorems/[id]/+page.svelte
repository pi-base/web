<script lang="ts">
  import { Show } from '@/components/Theorems'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData
</script>

<Show theorem={data.theorem} tab="converse" rel={$page.url.pathname} />
