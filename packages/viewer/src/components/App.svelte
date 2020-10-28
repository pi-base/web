<script lang="ts">
  import { Router } from 'svelte-routing'

  import { initialize, set } from '../context'

  import Nav from './Nav.svelte'
  import Routes from './Routes.svelte'

  set(initialize())
</script>

<Router>
  <Nav />
  <main class="container">
    <Routes />
  </main>
</Router>
