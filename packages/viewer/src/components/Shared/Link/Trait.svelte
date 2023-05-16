<script lang="ts">
  import { Link } from 'svelte-routing'
  import type { Property, Space } from '../../../models'
  import { Id } from '../../../models'

  export let property: Property
  export let space: Space
</script>

<Link
  to="/spaces/{Id.format('S', space.id)}/properties/{Id.format(
    'P',
    property.id,
  )}"
>
  <slot />
</Link>
