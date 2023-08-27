<script lang="ts">
  import Typeset from '../Typeset.svelte'
  import { Id } from '../../../models'

  export let property: { id: number; name: string }
</script>

<a href="/properties/{Id.format('P', property.id)}">
  <slot>
    <Typeset body={property.name} />
  </slot>
</a>
