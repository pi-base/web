<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Properties'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData

  $: title = `P${data.property.id}: ${data.property.name}`
</script>

<Title {title}/>

<Show property={data.property} tab="theorems" rel={$page.url.pathname} />
