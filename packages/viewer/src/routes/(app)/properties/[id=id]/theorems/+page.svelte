<script lang="ts">
  import { Show } from '@/components/Properties'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Show property={data.property} tab="theorems" />
