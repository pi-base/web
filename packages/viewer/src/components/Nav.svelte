<script lang="ts">
  import context from '@/context'
  import { categoryConfig, mainBranch } from '@/constants'
  import { Branch } from './Shared/Icons'

  const { showDev, source } = context()

  $: onMain = $source.branch === mainBranch
  $: bg = onMain ? 'light' : 'dark'
</script>

<nav class="navbar navbar-expand-lg navbar-{bg} bg-{bg}">
  <div class="container">
    <a class="navbar-brand" href="/">π-Base: {categoryConfig.subject}</a>

    <div class="navbar-nav mr-auto">
      <a class="nav-link" href="/spaces">Explore</a>
      <a class="nav-link" href="/spaces/all">{categoryConfig.objects}</a>
      <a class="nav-link" href="/properties">Properties</a>
      <a class="nav-link" href="/theorems">Theorems</a>
      {#if categoryConfig.showQuestions}<a class="nav-link" href="/questions"
          >Questions</a
        >{/if}
    </div>

    <div class="navbar-nav">
      <a class="nav-link" href="/dev">
        {#if showDev || !onMain}
          <Branch /> {$source.branch}
        {:else}
          Advanced
        {/if}
      </a>
      <a class="nav-link" href={categoryConfig.contributingUrl}>Contribute</a>
      <a class="nav-link" href={categoryConfig.helpUrl}>Help</a>
    </div>
  </div>
</nav>
