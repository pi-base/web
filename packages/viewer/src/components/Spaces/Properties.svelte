<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property, Space, Trait, Traits } from '@/models'

  export let space: Space

  function related(traits: Traits): [Space, Property, Trait][] {
    return traits.forSpace(space).map(([p, t]) => [space, p, t])
  }
</script>

<Related {related}>
  <span slot="title">Property</span>

  <Link.Property slot="id" let:property {property}>{property.id}</Link.Property>

  <Link.Property slot="name" let:property {property} />
</Related>
