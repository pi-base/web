<script lang="ts">
  import { Link } from 'svelte-routing'
  import { Id } from '../../../models'

  export let theorem: { id: number }
</script>

<Link to="/spaces/{Id.format('T', theorem.id)}">{theorem.id}</Link>
