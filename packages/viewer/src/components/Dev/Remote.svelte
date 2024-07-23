<script lang="ts">
  import { build } from '@/constants'
  import context from '@/context'
  import { state } from '@/stores/sync'
  import { bundle } from '@pi-base/core'

  import Sync from './Sync.svelte'

  const { source, sync } = context()
  const status = state(sync)

  let hostInput: HTMLInputElement
  const updateHost = () => source.setHost(hostInput.value)

  let branchInput: HTMLInputElement
  const updateBranch = () => source.checkout(branchInput.value)

  $: currentSha = $status?.sha
  $: dataSource = bundle.bundleUrl({
    branch: $source.branch,
    host: $source.host,
  })
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
        <code>{build.version}</code>
      </a>
    </td>
  </tr>
</table>

<h4>Data</h4>
<p>
  Using data hosted at <br />
  <small><a href={dataSource}><code>{dataSource}</code></a></small>
</p>
<table class="table">
  <tr>
    <th>Host</th>
    <td>
      <form on:submit={updateHost}>
        <input
          bind:this={hostInput}
          class="form-control"
          value={$source.host}
          on:blur={updateHost}
        />
      </form>
    </td>
  </tr>
  <tr>
    <th>Branch</th>
    <td>
      <form on:submit={updateBranch}>
        <input
          bind:this={branchInput}
          class="form-control"
          value={$source.branch}
          on:blur={updateBranch}
        />
      </form>
    </td>
  </tr>
  <tr>
    <th>SHA</th>
    <td>
      {#if currentSha}
        <a href={`https://github.com/pi-base/data/tree/${currentSha}`}>
          <code>{currentSha}</code>
        </a>
      {/if}
    </td>
  </tr>
  <tr>
    <th>Sync</th>
    <td>
      <Sync />
    </td>
  </tr>
</table>
