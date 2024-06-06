<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { Show } from '@/components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData

  $: title = `T${data.theorem.id}: ${data.theorem.name}`
</script>

{#key title}<Title {title} />{/key}

<Show theorem={data.theorem} tab="converse" />
