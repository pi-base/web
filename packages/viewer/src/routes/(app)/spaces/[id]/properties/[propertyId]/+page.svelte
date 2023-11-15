<script lang="ts">
  import { Show } from '@/components/Traits'

  import type { PageData } from './$types'

  export let data: PageData
</script>

<Show
  space={data.space}
  property={data.property}
  trait={data.trait}
  proof={data.proof}
  meta={data.meta}
/>
