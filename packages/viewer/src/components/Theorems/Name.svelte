<script lang="ts">
  import type Theorem from '@/models/Theorem'
  import { Formula } from '../Shared'

  export let theorem: Theorem
</script>

<Formula value={theorem.when} />
⇒
<Formula value={theorem.then} />
