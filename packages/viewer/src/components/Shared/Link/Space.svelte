<script lang="ts">
  import { Link } from 'svelte-routing'
  import Typeset from '../Typeset.svelte'
  import { Id } from '../../../models'

  export let space: { id: number; name: string }
</script>

<Link to="/spaces/{Id.format('S', space.id)}">
  <slot>
    <Typeset body={space.name} />
  </slot>
</Link>
