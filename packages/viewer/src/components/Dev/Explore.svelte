<script lang="ts">
  import { Link } from 'svelte-routing'
  import context from '../../context'
  import Log from './Log.svelte'

  const { spaces, properties, theorems, traits } = context()

  function reset() {
    localStorage.clear()
    window.location.reload()
  }
</script>

<h4>Entities</h4>
<table class="table">
  <tbody>
    <tr>
      <th>Spaces</th>
      <td>{$spaces.all.length}</td>
    </tr>
    <tr>
      <th>Properties</th>
      <td>{$properties.all.length}</td>
    </tr>
    <tr>
      <th>Theorems</th>
      <td>{$theorems.all.length}</td>
    </tr>
    <tr>
      <th>Traits</th>
      <td>{$traits.size}</td>
    </tr>
    <tr>
      <td colspan="2">
        <Log>Log to Console</Log>
        <Link
          type="button"
          getProps={() => ({ class: 'btn btn-outline-dark' })}
          to="/dev/preview">
          Editor Preview
        </Link>
        <button type="button" class="btn btn-outline-dark" on:click={reset}>
          Reset
        </button>
      </td>
    </tr>
  </tbody>
</table>
