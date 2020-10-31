<script lang="ts">
  import { Router } from 'svelte-routing'
  import { setContext } from 'svelte'

  export let initial: string
  setContext('TABS.INITIAL', initial)
</script>

<Router>
  <slot />
</Router>
