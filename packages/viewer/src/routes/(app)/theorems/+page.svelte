<script lang="ts">
  import { List } from '@/components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<h1>Theorems</h1>

<List theorems={data.theorems} />
