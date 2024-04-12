<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { List } from '@/components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Title title="Theorems" />

<h1>Theorems</h1>

<List theorems={data.theorems} />
