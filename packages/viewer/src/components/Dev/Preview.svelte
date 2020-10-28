<script lang="ts">
  import { Typeset } from '../Shared'

  let truncated = false
  let body = ''

  $: rows = Math.max(body.split('\n').length, 5)
</script>

<div class="row">
  <div class="col-sm">
    <div class="input-group">
      <textarea bind:value={body} class="form-control" {rows} />
    </div>
    <div class="input-group">
      <div class="form-check">
        <input
          type="checkbox"
          bind:checked={truncated}
          class="form-check-input"
          id="truncated" />
        <label class="form-check-label" for="truncated"> Truncated </label>
      </div>
    </div>
  </div>
  <div class="col-sm">
    <Typeset {body} {truncated} />
  </div>
</div>
