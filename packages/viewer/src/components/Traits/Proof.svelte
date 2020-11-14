<script lang="ts">
  import { Link } from '../Shared'
  import { Table as Theorems } from '../Theorems'
  import Value from './Value.svelte'
  import type { Property, Space, Theorem, Trait } from '../../models'

  export let space: Space
  export let theorems: Theorem[]
  export let traits: [Property, Trait][]
</script>

Automatically deduced from the following
<div class="row">
  <div class="col">
    <h5>Properties</h5>
    <table class="table">
      <thead>
        <tr>
          <th>Property</th>
          <th>Value</th>
          <th>Deduced</th>
        </tr>
      </thead>
      <tbody>
        {#each traits as [property, trait] (property.id)}
          <tr>
            <td>
              <Link.Property {property} />
            </td>
            <td>
              <Link.Trait {space} {property}>
                <Value value={trait.value} />
              </Link.Trait>
            </td>
            <td>
              {#if !trait.asserted}
                <Value value={true} />
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <div class="col">
    <h5>Theorems</h5>
    <Theorems {theorems} />
  </div>
</div>
