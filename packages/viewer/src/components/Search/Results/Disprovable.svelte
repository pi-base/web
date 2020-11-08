<script lang="ts">
  import type * as F from '@pi-base/core/lib/Formula'
  import { Formula, Id, Link } from '../../Shared'
  import type { Property, Theorem } from '../../../models'

  export let formula: F.Formula<Property>
  export let proof: Theorem[] | 'tautology'
</script>

{#if proof === 'tautology'}
  <Formula value={formula} />
  is a contradiction
{:else}
  <Formula value={formula} />
  is impossible by

  <table class="table">
    <thead>
      <tr>
        <th>Id</th>
        <th>When</th>
        <th>Then</th>
      </tr>
    </thead>
    <tbody>
      {#each proof as { uid, when, then } (uid)}
        <tr>
          <td>
            <Link to="/theorems/{uid}">
              <Id {uid} />
            </Link>
          </td>
          <td>
            <Formula value={when} />
          </td>
          <td>
            <Formula value={then} />
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
