<script lang="ts">
  import { getContext } from 'svelte'
  import { Route } from 'svelte-routing'

  export let path: string
  const initial = getContext('TABS.INITIAL')
</script>

{#if path === initial}
  <!-- Fallback route to this tab as well -->
  <Route>
    <slot />
  </Route>
{:else}
  <Route {path}>
    <slot />
  </Route>
{/if}
