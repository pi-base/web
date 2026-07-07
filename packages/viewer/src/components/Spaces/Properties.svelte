<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Space } from '@/models'

  export let space: Space
</script>

<Related anchor={{ mode: 'properties', space }}>
  <Link.Property slot="id" let:property {property} content="id" />

  <Link.Property slot="name" let:property {property} />
</Related>
