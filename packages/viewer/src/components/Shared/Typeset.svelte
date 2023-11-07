<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import context from '@/context'

  export let body: string
  export let truncated = false

  let container: HTMLElement

  const { typeset } = context()

  async function render(text: string, truncated_: boolean) {
    if (!container) {
      return
    }

    try {
      container.innerHTML = await $typeset(text, truncated_)
    } catch (e: any) {
      // FIXME: this is a kludgey fix for the fact that the {id} parser throws
      // assertion errors on incomplete / unbalanced sets of {}s. The better fix
      // is to make it more robust.
      if (e?.name === 'Assertion') {
        console.warn(e)
      } else {
        throw e
      }
    }

    /**
     * We're adding "real" <a/> tags to the DOM, even for parsed internal
     * links, but we really want to use the router to navigate. So we manually
     * bind click handlers to trigger navigation.
     */
    for (const link of container.getElementsByClassName('internal-link')) {
      /**
       * Unloading a DOM node should remove any bound listeners, but it's
       * unclear if iterative rendering could possibly double-bind click
       * handlers. This is probably unneccessary, but just being defensive.
       */
      if (link.getAttribute('_wired') === 'true') {
        continue
      }

      link.setAttribute('_wired', 'true')
      link.addEventListener('click', e => {
        e.preventDefault()
        goto((e.target as HTMLAnchorElement).href)
      })
    }
  }

  onMount(() => render(body, truncated))

  $: render(body, truncated)
</script>

<span bind:this={container} />
