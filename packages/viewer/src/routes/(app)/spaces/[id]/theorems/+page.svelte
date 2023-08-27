<script lang="ts">
  import Counterexamples from '../../../../../components/Spaces/Counterexamples.svelte'
  import type { PageData } from './$types'

  export let data: PageData
</script>

<Counterexamples space={data.space} />
