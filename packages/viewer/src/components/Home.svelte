<script lang="ts">
  import Cite from './Shared/Cite.svelte'
  import markdownit from 'markdown-it'
  const md = markdownit()

  import { categoryConfig } from '@/constants'
</script>

<div class="wide jumbotron home-jumbotron">
  <div class="container">
    <h1 class="display-4">π-Base: {categoryConfig.subject}</h1>
    <p class="lead">{categoryConfig.slogan}</p>
    <div class="ml-3 mt-4 calloutFeatures">
      {#each categoryConfig.calloutFeatures as feature}
        <p>
          ➜ {@html md.renderInline(feature)}
        </p>
      {/each}
    </div>
  </div>
</div>

<main class="container">
  {#if categoryConfig.acknowledgement}
    <blockquote class="blockquote text-center mt-5 mb-5">
      <p class="mb-0">
        {categoryConfig.acknowledgement.quote}
      </p>
      <footer class="blockquote-footer">
        {categoryConfig.acknowledgement.footer}
      </footer>
      <p class="mt-3">
        <small>
          {categoryConfig.acknowledgement.dedication}
        </small>
      </p>
    </blockquote>
    <hr />
  {/if}
  {@html md.render(categoryConfig.homeContent)}
</main>
<Cite />

<style>
  :global(.calloutFeatures a) {
    color: #17a2b8;
  }
</style>
