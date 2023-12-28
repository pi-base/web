<script lang="ts">
  import { List } from '@/components/Spaces'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<h1>Spaces</h1>

<List spaces={data.spaces} />
