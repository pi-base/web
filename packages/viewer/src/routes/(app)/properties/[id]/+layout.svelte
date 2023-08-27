<script lang="ts">
  import { Show } from '../../../../components/Properties'
  import Tabs from '../../../../components/Tabs.svelte'

  import type { PageData } from './$types'
  export let data: PageData
</script>

<Show property={data.property} />

<Tabs tabs={['spaces', 'theorems', 'references']} />

<slot />
