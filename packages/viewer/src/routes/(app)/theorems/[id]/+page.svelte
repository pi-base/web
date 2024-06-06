<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Theorems'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData

  $: title = `T${data.theorem.id}: ${data.theorem.name}`
</script>

<Title {title} />

<Show theorem={data.theorem} tab="converse" rel={$page.url.pathname} />
