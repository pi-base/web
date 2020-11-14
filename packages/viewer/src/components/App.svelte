<script lang="ts">
  import { Router } from 'svelte-routing'

  import { initialize, set } from '../context'

  import Nav from './Nav.svelte'
  import Routes from './Routes.svelte'
  import Status from './Status.svelte'

  const context = initialize()
  set(context)

  // HACK: the typsetter is a store derived from spaces / properties / theorems,
  // so that link rendering updates appropriately with new records. This
  // ensures that there is always at least one subscription to the derived store,
  // so that it doesn't get thrown away and rebuilt when the user happens to
  // navigate to a page without any rendered math.
  context.typeset.subscribe(() => {})
</script>

<Router>
  <Nav />
  <Status />
  <main class="container">
    <Routes />
  </main>
</Router>
