<script lang="ts">
  import { Icons } from '../Shared'
  export let filterMode: string
</script>

<button
  class="btn {filterMode === 'all' ? 'btn-secondary' : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'all'
  }}
>
  Show All
</button>
<button
  class="btn {filterMode === 'known'
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'known'
  }}
>
  <Icons.Check />
  <Icons.X />
</button>
<button
  class="btn {filterMode === 'true'
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'true'
  }}
>
  <Icons.Check />
</button>
<button
  class="btn {filterMode === 'false'
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'false'
  }}
>
  <Icons.X />
</button>
<button
  class="btn {filterMode === 'asserted'
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'asserted'
  }}
>
  <Icons.User />
</button>
<button
  class="btn {filterMode === 'missing'
    ? 'btn-secondary'
    : 'btn-outline-secondary'}"
  type="button"
  on:click={() => {
    filterMode = 'missing'
  }}
>
  <Icons.Question />
</button>
