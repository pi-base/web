<script lang="ts">
  import { Table as Theorems } from '../Theorems'
  import type { Property } from '../../models'
  import context from '../../context'

  export let property: Property

  const { theorems } = context()

  $: related = $theorems.forProperty(property)
</script>

<Theorems theorems={related} />
