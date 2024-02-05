<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property, Space, Trait, Traits } from '@/models'

  export let property: Property

  function related(traits: Traits): [Space, Property, Trait | undefined][] {
    return traits.forPropertyAll(property).map(([s, t]) => [s, property, t])
  }
</script>

<Related mode="spaces" {related}>
  <Link.Space slot="id" let:space {space} content="id" />

  <Link.Space slot="name" let:space {space} />
</Related>
