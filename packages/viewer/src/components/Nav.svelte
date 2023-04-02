<script lang="ts">
  import context from '../context'
  import { contributingUrl, mainBranch } from '../constants'
  import Branch from './Shared/Icons/Branch.svelte';

  import Link from './Nav/Link.svelte'

  const { showDev, source } = context()

  $: onMain = $source.branch === mainBranch
  $: bg = onMain ? 'light' : 'dark'
</script>

<nav class="navbar navbar-expand-lg navbar-{bg} bg-{bg}">
  <div class="container">
    <Link brand to="/">π-Base</Link>

    <div class="navbar-nav mr-auto">
      <Link to="/explore">Explore</Link>
      <Link to="/spaces">Spaces</Link>
      <Link to="/properties">Properties</Link>
      <Link to="/theorems">Theorems</Link>
    </div>

    <div class="navbar-nav">
      <Link to="/dev">
        {#if showDev || !onMain}
          <Branch/> {$source.branch}
        {:else}
          Advanced
        {/if}
      </Link>
      <a class="nav-link" href={contributingUrl}>Contribute</a>
    </div>
  </div>
</nav>
