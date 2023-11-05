<script lang="ts">
  import { Show } from '@/components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Show theorem={data.theorem} tab="converse" />
