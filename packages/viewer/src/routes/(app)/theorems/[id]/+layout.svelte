<script lang="ts">
  import { Show } from '../../../../components/Theorems'
  import Tabs from '../../../../components/Tabs.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<Show theorem={data.theorem} />

<Tabs tabs={['converse', 'references']} />

<slot />
