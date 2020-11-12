<script lang="ts">
  import { Link } from 'svelte-routing'
  import Typeset from '../Typeset.svelte'
  import { Id } from '../../../models'

  export let property: { id: number; name: string }
</script>

<Link to="/properties/{Id.format('P', property.id)}">
  <slot>
    <Typeset body={property.name} />
  </slot>
</Link>
