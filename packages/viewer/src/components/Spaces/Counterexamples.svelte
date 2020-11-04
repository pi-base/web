<script lang="ts">
  import context from '../../context'
  import type { Space } from '../../types'
  import { Formula, Link, Typeset } from '../Shared'

  export let space: Space

  const { theorems, traits } = context()

  $: results = $theorems.all.filter((theorem) =>
    $traits.isCounterexample(theorem, space),
  )
</script>

<Typeset body={space.name} />
is a counterexample to the converse of
{results.length}
theorems

{#if results.length > 0}
  <table class="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>When</th>
        <th>Then</th>
      </tr>
    </thead>
    <tbody>
      {#each results as { uid, when, then } (uid)}
        <tr>
          <td>
            <Link to="/theorems/{uid}">{uid}</Link>
          </td>
          <td>
            <Formula value={when} />
          </td>
          <td>
            <Formula value={then} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
