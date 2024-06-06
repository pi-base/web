<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Properties'
  import type { PageData } from './$types'

  export let data: PageData

  $: title = `P${data.property.id}: ${data.property.name}`
</script>

{#key title}<Title {title} />{/key}

<Show property={data.property} tab="spaces" />
