<script lang="ts">
  import context from '../context'
  import { contributingUrl, mainBranch } from '../constants'

  import Link from './Nav/Link.svelte'

  const { showDev, source } = context()

  $: onMain = $source.branch === mainBranch
  $: bg = onMain ? 'light' : 'dark'
</script>

<nav class="navbar navbar-expand-lg navbar-{bg} bg-{bg}">
  <div class="container">
    <a class="navbar-brand" href="/">π-Base</a>

    <div class="navbar-nav mr-auto">
      <Link to="/spaces">Spaces</Link>
      <Link to="/properties">Properties</Link>
      <Link to="/theorems">Theorems</Link>
    </div>

    <div class="navbar-nav">
      {#if showDev || !onMain}
        <Link to="/dev">{$source.branch}</Link>
      {/if}
      <a class="nav-link" href={contributingUrl}>Contribute</a>
    </div>
  </div>
</nav>
