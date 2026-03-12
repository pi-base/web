<script lang="ts">
  import { Link } from '../Shared'
  import { Table as Theorems } from '../Theorems'
  import ValueIcon from './ValueIcon.svelte'
  import type { Property, Space, Theorem, Trait } from '@/models'

  export let space: Space
  export let theorems: Theorem[]
  export let traits: [Property, Trait][]
  $: emphasizedProperties = new Set(traits.map(([p, _]) => p))
</script>

Automatically deduced from the following:
<div style="margin:1em 0">
  <h5>Properties</h5>
  <table class="table">
    <thead>
      <tr>
        <th>Property</th>
        <th>Value</th>
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
              <ValueIcon value={trait.value} />
            </Link.Trait>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
  <h5>Theorems</h5>
  <Theorems {theorems} {emphasizedProperties} />
</div>
