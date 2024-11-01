<script lang="ts">
  import { Typeset, Source } from '../Shared'
  import Example from './Example.svelte'

  let truncated = false
  let body = ''

  $: rows = Math.max(body.split('\n').length, 5)
</script>

<div class="row">
  <div class="col-sm">
    <div class="input-group">
      <textarea
        bind:value={body}
        class="form-control"
        data-testid="input"
        {rows}
      />
    </div>
    <div class="input-group">
      <div class="form-check">
        <input
          type="checkbox"
          bind:checked={truncated}
          class="form-check-input"
          id="truncated"
        />
        <label class="form-check-label" for="truncated"> Truncated </label>
      </div>
    </div>

    <Example
      set={value => {
        body = value
      }}
    />
  </div>
  <div class="col-sm" data-testid="output">
    <Typeset {body} {truncated} />
    <hr />
    <section class="description-markdown">
      <Source source={body} external />
    </section>
  </div>
</div>
