<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Spaces'
  import type { PageData } from './$types'
  import { page } from '$app/stores'

  export let data: PageData
  let rel = $page.url.pathname

  $: title = `S${data.space.id}: ${data.space.name}`
</script>

<Title {title} />

<Show space={data.space} tab="properties" {rel} />
