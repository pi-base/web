<script lang="ts">
  import Title from '@/components/Shared/Title.svelte';
  import { List } from '@/components/Properties'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Title title="Properties" />

<h1>Properties</h1>

<List properties={data.properties} />
