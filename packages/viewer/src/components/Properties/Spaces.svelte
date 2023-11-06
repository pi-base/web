<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property, Space, Trait, Traits } from '@/models'

  export let property: Property

  function related(traits: Traits): [Space, Property, Trait][] {
    return traits.forProperty(property).map(([s, t]) => [s, property, t])
  }
</script>

<Related {related}>
  <span slot="title">Space</span>

  <Link.Space slot="id" let:space {space}>{space.id}</Link.Space>

  <Link.Space slot="name" let:space {space} />
</Related>
