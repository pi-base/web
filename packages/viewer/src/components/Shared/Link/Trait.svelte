<script lang="ts">
  import { type Property, type Space, Id } from '@/models'

  export let property: Property
  export let space: Space
</script>

<a
  class="text-info"
  href="/spaces/{Id.format('S', space.id)}/properties/{Id.format(
    'P',
    property.id,
  )}"
>
  <slot />
</a>
