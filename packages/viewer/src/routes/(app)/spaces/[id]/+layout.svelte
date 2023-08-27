<script lang="ts">
  import { Show } from '../../../../components/Spaces'
  import Tabs from '../../../../components/Tabs.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<Show space={data.space} />

<Tabs tabs={['properties', 'theorems', 'references']} />

<slot />
