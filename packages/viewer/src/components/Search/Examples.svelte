<script lang="ts">
  export let select: (search: string) => void

  const examples = [
    {
      label: 'All Non-Metric Continua',
      search: 'compact + connected + t_2 + ~metrizable',
    },
    {
      label: 'A Common Non-Theorem',
      search: 'first countable + separable + ~second countable',
    },
  ]
</script>

<p><b>Not sure where to start?</b> Try one of the following searches:</p>
{#each examples as { label, search } (label)}
  <article>
    <h5>{label}</h5>
    <!-- TODO: we shouldn't need an on:click here -->
    <a
      href={`?q=${encodeURIComponent(search)}`}
      on:click={() => select(search)}
      class="example"
    >
      {search}
    </a>
  </article>
{/each}
