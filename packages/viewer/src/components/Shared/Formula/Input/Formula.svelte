<script lang="ts">
  import type { Writable } from 'svelte/store'

  import context from '@/context'
  import type { Formula, Property } from '@/models'

  import { create } from './store'
  import Suggestions from './Suggestions.svelte'

  export let raw: Writable<string>
  export let formula: Writable<Formula<Property> | undefined>
  export let name: string
  export let placeholder: string | undefined = undefined
  export let suggest = true

  const store = create({ raw, formula, properties: context().properties })

  function handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        store.changeSelected(-1)
        return
      case 'ArrowDown':
        store.changeSelected(1)
        return
      case 'Tab':
        event.preventDefault()
      case 'Enter':
      case 'ArrowRight':
        store.expand()
        return
    }
  }
</script>

<input
  class="form-control"
  autocomplete="off"
  {name}
  {placeholder}
  bind:value={$raw}
  on:keydown={handleKeyDown}
/>

{#if suggest && $store.suggest}
  <Suggestions
    suggestions={$store.suggestions}
    selected={$store.selected}
    onHover={store.setSelected}
    onClick={store.expand}
  />
{/if}
