<script lang="ts">
  import * as F from '@pi-base/core/lib/Formula'

  import { Formula, Link, Typeset } from '../Shared'
  import { Value } from '../Traits'
  import context from '../../context'
  import { search } from '../../stores'
  import type { Property, Space } from '../../types'

  export let text: string
  export let formula: F.Formula<Property> | undefined

  const { spaces, traits } = context()
  const store = search({ spaces, traits })

  $: results = store.search({ text, formula })
  $: properties = formula ? Array.from(F.properties(formula)) : []
</script>

Spaces
{#if text}matching <code>{text}</code>{/if}
{#if text && formula}and{/if}
{#if formula}
  satisfying
  <Formula value={formula} />
{/if}

<table class="table">
  <thead>
    <tr>
      <td />
      {#each properties as { uid, name: property }}
        <td>
          <Link to="/properties/${uid}">
            <Typeset body={property} />
          </Link>
        </td>
      {/each}
    </tr>
  </thead>
  <tbody>
    {#each results as space (space.uid)}
      <tr>
        <td>
          <Link to="/spaces/${space.uid}">
            <Typeset body={space.name} />
          </Link>
        </td>
        {#each properties as property (property.uid)}
          <td>
            <Link to="/spaces/{space.uid}/properties/{property.uid}">
              <Value value={$traits.find(space, property)?.value} />
            </Link>
          </td>
        {/each}
      </tr>
    {/each}
  </tbody>
</table>
