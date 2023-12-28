<script lang="ts">
  import { List } from '@/components/Properties'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<h1>Properties</h1>

<List properties={data.properties} />
