<script lang="ts">
  import Title from '@/components/Shared/Title.svelte'
  import { categoryConfig } from '@/constants'
  import { List } from '@/components/Spaces'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Title title={categoryConfig.objects} />

<h1>{categoryConfig.objects}</h1>

<List spaces={data.spaces} />
