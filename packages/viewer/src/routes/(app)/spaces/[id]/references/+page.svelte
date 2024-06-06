<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Spaces'
  import type { PageData } from './$types'

  export let data: PageData
  $: title = `S${data.space.id}: ${data.space.name}`
</script>

{#key title}<Title {title} />{/key}

<Show space={data.space} tab="references" />
