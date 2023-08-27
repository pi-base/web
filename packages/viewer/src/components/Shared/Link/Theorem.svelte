<script lang="ts">
  import { Id } from '../../../models'

  export let theorem: { id: number }
</script>

<a href="/theorems/{Id.format('T', theorem.id)}">{theorem.id}</a>
