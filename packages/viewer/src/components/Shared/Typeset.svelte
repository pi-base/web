<script lang="ts">
  import { onMount } from 'svelte'
  import { render as renderer } from './render-utils'

  export let body: string
  export let truncated = false

  let container: HTMLElement

  async function render(text: string, truncated_: boolean) {
    if (container) {
      container.innerHTML = await renderer(text, truncated_)
    }
  }

  onMount(() => render(body, truncated))

  $: render(body, truncated)
</script>

<span bind:this={container} />
