<script lang="ts">
  import context from '@/context'
  import Log from './Log.svelte'
  import { reset } from '@/util'

  const { spaces, properties, theorems, traits } = context()
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
        <a type="button" class="btn btn-outline-dark" href="/dev/preview">
          Editor Preview
        </a>
        <button type="button" class="btn btn-outline-dark" on:click={reset}>
          Reset
        </button>
      </td>
    </tr>
  </tbody>
</table>
