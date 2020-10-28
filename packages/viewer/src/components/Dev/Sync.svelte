<script lang="ts">
  import context from '../../context'

  import Age from '../Shared/Age.svelte'
  import { Repeat } from '../Shared/Icons'

  const { sync } = context()

  $: state = $sync
</script>

{#if state.kind === 'fetching'}
  <button type="button" class="btn rotate" disabled>
    <Repeat />
  </button>
{:else if state.kind === 'fetched'}
  <button type="button" class="btn" on:click={sync.sync}>
    <Repeat />
  </button>
  <Age date={state.at} />
{:else}
  <button type="button" class="btn" on:click={sync.sync}>
    <Repeat />
  </button>
  Error
  <code>{state.error}</code>
{/if}
