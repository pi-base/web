<script lang="ts">
  import { Formula, Id, Link } from '../Shared'
  import Value from './Value.svelte'
  import type { Space, Theorem } from '../../models'

  export let space: Space
  export let traits: {
    pid: string
    name: string
    value: boolean
    deduced: boolean
  }[]
  export let theorems: Theorem[]
</script>

Automatically deduced from the following
<div class="row">
  <div class="col">
    <h5>Properties</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
          <th>Deduced</th>
        </tr>
      </thead>
      <tbody>
        {#each traits as { pid, name, value, deduced } (pid)}
          <tr>
            <td>
              <Link to="/properties/{pid}">{name}</Link>
            </td>
            <td>
              <Link to="/spaces/{space.uid}/properties/{pid}">
                <Value {value} />
              </Link>
            </td>
            <td>
              {#if deduced}
                <Value value={true} />
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="col">
    <h5>Theorems</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>When</th>
          <th>Then</th>
        </tr>
      </thead>
      <tbody>
        {#each theorems as { uid, when, then } (uid)}
          <tr>
            <td>
              <Link to="/theorems/{uid}">
                <Id {uid} />
              </Link>
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
  </div>
</div>
