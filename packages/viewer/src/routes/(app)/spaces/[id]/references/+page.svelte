<script lang="ts">
  import { Show } from '@/components/Spaces'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Show space={data.space} tab="references" />
