<script lang="ts">
  import context from '../../context'
  import Log from './Log.svelte'
  import { Link } from '../Shared'

  const { spaces, properties, theorems } = context()
</script>

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
      <th />
      <td>
        <Log>Log to Console</Log>
        <Link
          type="button"
          getProps={() => ({ class: 'btn btn-outline-dark' })}
          to="/dev/preview">
          Editor Preview
        </Link>
      </td>
    </tr>
  </tbody>
</table>
