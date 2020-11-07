<script lang="ts">
  import Fuse from 'fuse.js'
  import { Icons, Link, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import context from '../../context'
  import type { Traits } from '../../models'
  import type { Property, Trait } from '../../types'

  interface Record {
    uid: string
    name: string
  }

  export let label: string
  export let related: (traits: Traits) => [Record, Trait][]
  export let linkRecord: (uid: string) => string
  export let linkTrait: (uid: string) => string

  const { traits } = context()

  let filter = ''
  let showDeduced = false

  function toggleDeduced() {
    showDeduced = !showDeduced
  }

  $: all = related($traits)
  $: index = new Fuse(all, { keys: ['0.name'] })
  $: searched = filter ? index.search(filter).map((r) => r.item) : all
  $: filtered = searched.filter(([_, t]) => showDeduced || !t.proof)
</script>

<div class="input-group">
  <div class="input-group-prepend">
    <span class="input-group-text">
      <Icons.Search />
    </span>
  </div>
  <input placeholder="Filter" class="form-control" bind:value={filter} />
  <div class="input-group-append">
    <button
      class="btn btn-outline-secondary {showDeduced ? 'active' : ''}"
      type="button"
      on:click={toggleDeduced}>
      Deduced
    </button>
  </div>
</div>

<table class="table">
  <thead>
    <tr>
      <th>{label}</th>
      <th>Value</th>
      <th>Deduced</th>
    </tr>
  </thead>
  <tbody>
    {#each filtered as [{ uid, name }, { value, proof }] (uid)}
      <tr>
        <td>
          <Link to={linkRecord(uid)}>
            <Typeset body={name} />
          </Link>
        </td>
        <td>
          <Link to={linkTrait(uid)}>
            <Value {value} />
          </Link>
        </td>
        <td>
          {#if proof}
            <Value value={true} />
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
