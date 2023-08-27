<script lang="ts">
  import { References } from '../../../../../components/Shared'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<References references={data.theorem.refs} />
