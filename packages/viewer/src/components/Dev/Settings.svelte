<script lang="ts">
  import Explore from './Explore.svelte'
  import Remote from './Remote.svelte'
</script>

<div class="row">
  <div class="col">
    <Remote />
  </div>
  <div class="col">
    <Explore />
    <hr />
    <h4>Community tools</h4>
    <ul>
      <li>
        <a href="https://observablehq.com/@dinod123/pi-base-tools"
          >Pi-Base tools</a
        >
        by @danflapjax to check and visualize dependencies between properties.
      </li>
      <li>
        <a href="https://felixpernegger.github.io/pibase-data/"
          >pi-base open implications</a
        >
        by Felix Pernegger to resolve unknown implications.
      </li>
    </ul>
  </div>
</div>
