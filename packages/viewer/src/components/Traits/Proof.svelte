<script lang="ts">
  import { writable } from 'svelte/store'
  import { Icons, Link } from '../Shared'
  import { Table as Theorems } from '../Theorems'
  import Graph from './Graph.svelte'
  import Value from './Value.svelte'
  import type { Property, Space, Theorem, Trait } from '@/models'
  import { toGraph } from './graph'

  export let space: Space
  export let property: Property
  export let theorems: Theorem[]
  export let traits: [Property, Trait][]

  const selected = writable<Property | Theorem>()

  $: graph = toGraph(property, traits, theorems)
</script>

<Icons.Robot />

Automatically deduced from the following:

<div class="row">
  <div class="col-6">
    <Graph {graph} {selected} />
  </div>
  <div class="col-6">
    <table class="table table-sm">
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {#each traits as [property, trait] (property.id)}
          <tr class:table-warning={$selected === property}>
            <td>
              <Link.Property {property} />
            </td>
            <td>
              <Link.Trait {space} {property}>
                <Value value={trait.value} />
              </Link.Trait>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    <Theorems {theorems} small={true} {selected} />
  </div>
</div>
