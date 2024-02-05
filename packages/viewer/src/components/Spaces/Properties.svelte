<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property, Space, Trait, Traits } from '@/models'

  export let space: Space

  function related(traits: Traits): [Space, Property, Trait|undefined][] {
    return traits.forSpaceAll(space).map(([p, t]) => [space, p, t])
  }
</script>

<Related mode="properties" {related}>
  <Link.Property slot="id" let:property {property} content="id" />

  <Link.Property slot="name" let:property {property} />
</Related>
