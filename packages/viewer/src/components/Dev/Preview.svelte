<script lang="ts">
  import { Typeset, Source } from '../Shared'

  let truncated = false
  let body = `
Modify this text to preview π-Base-flavored Markdown!

### Features

π-Base supports inline math $2 + 2 = 4$ and display math
$$x=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}.$$

This is a list of internal links:

* {S000123}
* {P000123}
* {T000123}
* {S000123|P000123}

This is a list of external references:

* {{doi:123}}
* {{mr:123}}
* {{wikipedia:123}}
* {{mathse:123}}
* {{mo:123}}
* {{zb:123}}
`.trim()

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

    <table class="table">
      <thead>
        <tr>
          <th colspan="2">Reference</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Inline Math</th>
          <td><code>$ ... $</code> or <code>\( ... \)</code></td>
        </tr>
        <tr>
          <th>Display Math</th>
          <td><code>$$ ... $$</code> or <code>\[ ... \]</code></td>
        </tr>
        <tr>
          <th>Internal Links</th>
          <td>
            <code>{'{uid}'}</code>
            - e.g.
            <code>{'{S000001}'}</code>
            for space 1
            <br />
            <code>{'{S000001|P000002}'}</code>
            for space 1's value of property 2
          </td>
        </tr>
        <tr>
          <th>External Links</th>
          <td>
            <code>{'{{<provider>:<id>}}'}</code>
            - e.g.
            <code>{'{{doi:123}}'}</code>.

            <p>
              Provider should be one of:
              <code>doi</code>,
              <code>mr</code>,
              <code>wikipedia</code>,
              <code>mathse</code>, or
              <code>mo</code>, or
              <code>zb</code>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="col-sm" data-testid="output">
    <Typeset {body} {truncated} />
    {#if body.trim().length > 0}
      <hr />
      <section class="description-markdown">
        <Source source={body} external />
      </section>
    {/if}
  </div>
</div>
