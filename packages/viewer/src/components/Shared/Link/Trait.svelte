<script lang="ts">
  import type { Property, Space } from '../../../models'
  import { Id } from '../../../models'

  export let property: Property
  export let space: Space
</script>

<a
  href="/spaces/{Id.format('S', space.id)}/properties/{Id.format(
    'P',
    property.id,
  )}"
>
  <slot />
</a>
