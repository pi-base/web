<script lang="ts">
  import { Link, Id, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import type { Property, Space, Trait } from '../../types'
  import context from '../../context'
  import { idToInt } from '../../util'

  export let property: Property

  const { spaces, traits } = context()

  // TODO: improve performance. May want a trait (and theorem) store proper
  // and domain objects (e.g. with getters)
  // TODO: fuzzy find, sort, toggle deduced
  $: related = $traits.all.reduce((acc: [Space, Trait][], t: Trait) => {
    if (t.property === property.uid) {
      const space = $spaces.find(idToInt(t.space))
      if (space) {
        return [...acc, [space, t]] as [Space, Trait][]
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
          <Link to="/spaces/{uid}">
            <Id {uid} />
          </Link>
        </td>
        <td>
          <Typeset body={name} />
        </td>
        <td>
          <Value {value} />
        </td>
      </tr>
    {/each}
  </tbody>
</table>
