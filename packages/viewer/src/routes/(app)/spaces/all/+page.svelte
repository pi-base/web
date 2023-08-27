<script lang="ts">
  import { List } from '../../../../components/Spaces'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<List spaces={data.spaces} />
