<script lang="ts">
  import { buildVersion } from '../../constants'
  import context from '../../context'
  import { state } from '../../stores/sync'

  import Sync from './Sync.svelte'

  const { source, sync } = context()
  const status = state(sync)

  $: currentSha = $status?.sha
</script>

<table class="table">
  <tr>
    <th>Build</th>
    <td><code>{buildVersion}</code></td>
  </tr>
  <tr>
    <th>Host</th>
    <td>
      <input
        class="form-control"
        value={$source.host}
        on:blur={(e) => source.setHost(e.currentTarget.value)} />
    </td>
  </tr>
  <tr>
    <th>Branch</th>
    <td>
      <input
        class="form-control"
        value={$source.branch}
        on:blur={(e) => source.checkout(e.currentTarget.value)} />
    </td>
  </tr>
  <tr>
    <th>SHA</th>
    <td>
      {#if currentSha}<code>{currentSha}</code>{/if}
    </td>
  </tr>
  <tr>
    <th>Sync</th>
    <td>
      <Sync />
    </td>
  </tr>
</table>
