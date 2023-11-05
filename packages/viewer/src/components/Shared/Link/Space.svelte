<script lang="ts">
  import Typeset from '../Typeset.svelte'
  import { Id } from '@/models'

  export let space: { id: number; name: string }
</script>

<a href="/spaces/{Id.format('S', space.id)}">
  <slot>
    <Typeset body={space.name} />
  </slot>
</a>
