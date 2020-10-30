<script lang="ts">
  export let set: (body: string) => void

  const example = `Inline math $2 + 2 = 4$ and display math $$2 + 2 = 4$$.

This is a list of links

* {S000123}
* {P000123}
* {T000123}
* {{doi:123}}
* {{mr:123}}
* {{wikipedia:123}}
* {{mathse:123}}
* {{mo:123}}`
</script>

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
      </td>
    </tr>
    <tr>
      <th>External Links</th>
      <td>
        <code>{'{{<provider>:<id>}'}</code>
        - e.g.
        <code>{'{{doi:123}}'}</code>.

        <p>
          Provider should be one of:
          <code>doi</code>,
          <code>mr</code>,
          <code>wikipedia</code>,
          <code>mathse</code>, or
          <code>mo</code>
        </p>
      </td>
    </tr>
    <tr>
      <th />
      <td>
        <button class="btn btn-outline-dark" on:click={() => set(example)}>
          Example
        </button>
      </td>
    </tr>
  </tbody>
</table>
