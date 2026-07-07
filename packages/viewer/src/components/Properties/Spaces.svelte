<script lang="ts">
  import { Link } from '../Shared'
  import { Related } from '../Traits'
  import type { Property } from '@/models'

  export let property: Property
</script>

<Related anchor={{ mode: 'spaces', property }}>
  <Link.Space slot="id" let:space {space} content="id" />

  <Link.Space slot="name" let:space {space} />
</Related>
