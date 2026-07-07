<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property, Space, Trait, Traits } from '@/models'

  export let space: Space

  // Reactive so that Related recomputes when navigating between spaces
  $: related = (traits: Traits): [Space, Property, Trait | undefined][] =>
    traits.forSpaceAll(space).map(([p, t]) => [space, p, t])
</script>

<Related mode="properties" {related}>
  <Link.Property slot="id" let:property {property} content="id" />

  <Link.Property slot="name" let:property {property} />
</Related>
