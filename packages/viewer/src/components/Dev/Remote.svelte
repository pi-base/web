<script lang="ts">
  import { build } from '@/constants'
  import context from '@/context'
  import { state } from '@/stores/sync'

  import Sync from './Sync.svelte'

  const { source, sync } = context()
  const status = state(sync)

  $: currentSha = $status?.sha
</script>

<h4>Viewer</h4>
<table class="table">
  <tr>
    <th>Branch</th>
    <td>
      <a href={`https://github.com/pi-base/web/tree/${build.branch}`}>
        {build.branch}
      </a>
    </td>
  </tr>
  <tr>
    <th>SHA</th>
    <td>
      <a href={`https://github.com/pi-base/web/tree/${build.version}`}>
        {build.version}
      </a>
    </td>
  </tr>
</table>

<h4>Data</h4>
<table class="table">
  <tr>
    <th>Host</th>
    <td>
      <input
        class="form-control"
        value={$source.host}
        on:blur={e => source.setHost(e.currentTarget.value)}
      />
    </td>
  </tr>
  <tr>
    <th>Branch</th>
    <td>
      <input
        class="form-control"
        value={$source.branch}
        on:blur={e => source.checkout(e.currentTarget.value)}
      />
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
