<script lang="ts">
  export let select: (search: string) => void

  const examples = [
    {
      label: 'All Non-Metric Continua',
      display: 'compact + connected + t_2 +\n~metrizable',
      search: 'compact + connected + t_2 + ~metrizable',
    },
    {
      label: 'A Common Non-Theorem',
      display: 'first countable + separable\n+ ~second countable',
      search: 'first countable + separable + ~second countable',
    },
  ]
</script>

<p><b>Not sure where to start?</b> Try one of the following searches:</p>
{#each examples as { label, search, display } (label)}
  <article>
    <h5>{label}</h5>
    <pre class="example" on:click={() => select(search)}>{display}</pre>
  </article>
{/each}
