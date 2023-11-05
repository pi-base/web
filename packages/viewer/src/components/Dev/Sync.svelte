<script lang="ts">
  import context from '@/context'

  import { Age, Icons } from '../Shared'

  const { sync } = context()

  $: state = $sync
</script>

{#if state.kind === 'fetching'}
  <button type="button" class="btn" disabled>
    <Icons.Repeat rotate={true} />
  </button>
{:else if state.kind === 'fetched'}
  <button type="button" class="btn" on:click={sync.sync}>
    <Icons.Repeat />
  </button>
  <Age date={state.at} />
{:else if state.kind === 'error'}
  <button type="button" class="btn" on:click={sync.sync}>
    <Icons.Repeat />
  </button>
  Error
  <code>{state.error}</code>
{/if}
