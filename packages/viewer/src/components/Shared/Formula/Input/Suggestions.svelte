<script lang="ts">
  import type { Property } from '@/models'
  import { Typeset } from '@/components/Shared'

  export let suggestions: Property[]
  export let selected: number | undefined
  export let onHover: (index: number) => void
  export let onClick: (index: number) => void
</script>

<ul class="list-group suggestions">
  {#each suggestions as property, i (property.id)}
    <li
      class="list-group-item {i === selected ? 'active' : ''}"
      on:mouseover={() => onHover(i)}
      on:focus={() => onHover(i)}
      on:click={() => onClick(i)}
      on:keydown={() => onClick(i)}
    >
      <Typeset body={property.name} />
    </li>
  {/each}
</ul>
