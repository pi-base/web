<script lang="ts">
  import { Title } from '@/components/Shared'
  import { Show } from '@/components/Traits'
  import type { PageData } from './$types'
  export let data: PageData

  $: title = `S${data.space.id}|P${data.property.id}: ${data.space.name} | ${data.property.name}`
</script>

<Title {title} />

<Show
  space={data.space}
  property={data.property}
  trait={data.trait}
  proof={data.proof}
  meta={data.meta}
/>
