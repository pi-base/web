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
    <li class="list-group-item {i === selected ? 'active' : ''}">
      <div
        role="button"
        tabindex={i}
        on:mouseover={() => onHover(i)}
        on:focus={() => onHover(i)}
        on:click={() => onClick(i)}
        on:keydown={() => onClick(i)}
      >
        <Typeset body={property.name} />
        {#if property.aliases.length > 0}
          <br />
          <small class={i === selected ? 'active' : 'text-muted'}>
            {#each property.aliases as alias, i}
              {#if i > 0},{' '}{/if}
              <Typeset body={alias} />
            {/each}
          </small>
        {/if}
      </div>
    </li>
  {/each}
</ul>
