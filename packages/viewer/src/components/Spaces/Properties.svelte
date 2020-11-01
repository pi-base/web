<script lang="ts">
  import { Link, Id, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import type { Property, Space, Trait } from '../../types'
  import context from '../../context'
  import { idToInt } from '../../util'

  export let space: Space

  const { properties, traits } = context()

  // TODO: improve performance. May want a trait (and theorem) store proper
  // and domain objects (e.g. with getters)
  // TODO: fuzzy find, sort, toggle deduced
  $: related = $traits.all.reduce((acc: [Property, Trait][], t: Trait) => {
    if (t.space === space.uid) {
      const property = $properties.find(idToInt(t.property))
      if (property) {
        return [...acc, [property, t]] as [Property, Trait][]
      }
    }
    return acc
  }, [])
</script>

<table class="table">
  <thead>
    <tr>
      <th>Id</th>
      <th>When</th>
      <th>Then</th>
    </tr>
  </thead>
  <tbody>
    {#each related as [{ uid, name }, { value }] (uid)}
      <tr>
        <td>
          <Link to="/properties/{uid}">
            <Id {uid} />
          </Link>
        </td>
        <td>
          <Typeset body={name} />
        </td>
        <td>
          <Link to="/spaces/{space.uid}/properties/{uid}">
            <Value {value} />
          </Link>
        </td>
      </tr>
    {/each}
  </tbody>
</table>
