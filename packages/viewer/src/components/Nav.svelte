<script lang="ts">
  import context from '@/context'
  import { contributingUrl, mainBranch, helpUrl } from '@/constants'
  import Branch from './Shared/Icons/Branch.svelte'

  const { showDev, source } = context()

  $: onMain = $source.branch === mainBranch
  $: bg = onMain ? 'light' : 'dark'
</script>

<nav class="navbar navbar-expand-lg navbar-{bg} bg-{bg}">
  <div class="container">
    <a class="navbar-brand" href="/">π-Base</a>

    <div class="navbar-nav mr-auto">
      <a class="nav-link" href="/spaces">Explore</a>
      <a class="nav-link" href="/spaces/all">Spaces</a>
      <a class="nav-link" href="/properties">Properties</a>
      <a class="nav-link" href="/theorems">Theorems</a>
      <a class="nav-link" href="/questions">Questions</a>
    </div>

    <div class="navbar-nav">
      <a class="nav-link" href="/dev">
        {#if showDev || !onMain}
          <Branch /> {$source.branch}
        {:else}
          Advanced
        {/if}
      </a>
      <a class="nav-link" href={contributingUrl}>Contribute</a>
      <a class="nav-link" href={helpUrl}>Help</a>
    </div>
  </div>
</nav>
