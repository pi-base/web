<script lang="ts">
  import type { Writable } from 'svelte/store'
  import { Search } from './Icons'

  export let filter: Writable<string>
</script>

<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text">
      <Search />
    </span>
  </div>
  <input placeholder="Filter" class="form-control" bind:value={$filter} />
</div>
