<script lang="ts">
  import { List } from '../../../components/Theorems'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<List theorems={data.theorems} />
