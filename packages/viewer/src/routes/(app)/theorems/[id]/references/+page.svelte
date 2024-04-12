<script lang="ts">
  import Title from '@/components/Shared/Title.svelte';
  import { Show } from '@/components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData

  $: title = `S${data.theorem.id}: ${data.theorem.name}`
</script>

<Title {title}/>

<Show theorem={data.theorem} tab="references" />
