<script lang="ts">
  import { writable } from 'svelte/store'

  import type { Formula, Property } from '../../models'
  import urlSearchParam from '../../stores/urlSearchParam'
  import Examples from './Examples.svelte'
  import FormulaInput from '../Shared/Formula/Input'
  import Results from './Results.svelte'

  const text = writable('')
  const rawFormula = writable('')
  const formula = writable<Formula<Property> | undefined>(undefined)

  urlSearchParam('text', text)
  urlSearchParam('formula', rawFormula)
</script>

<div class="row">
  <div class="col-4">
    <div class="form-group">
      <label class="form-label" for="text">Filter by Text</label>
      <input
        class="form-control"
        name="text"
        placeholder="e.g. plank"
        bind:value={$text} />
    </div>
    <div class="form-group">
      <label class="form-label" for="formula">Filter by Formula</label>
      <FormulaInput
        name="formula"
        placeholder="e.g. compact + metrizable"
        raw={rawFormula}
        {formula} />
    </div>
  </div>
  <div class="col-8">
    {#if $text || $formula}
      <Results text={$text} formula={$formula} />
    {:else}
      <Examples select={(example) => ($rawFormula = example)} />
    {/if}
  </div>
</div>
