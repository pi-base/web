<script lang="ts">
  import { List } from '@/components/Properties'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<List properties={data.properties} />
