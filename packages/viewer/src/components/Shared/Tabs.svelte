<script lang="ts">
  import { capitalize } from '@/util'

  type T = $$Generic
  type Tab = T & string

  export let tabs: readonly Tab[]
  export let tab: Tab
  export let rel: string | undefined = undefined
</script>

<ul class="nav nav-tabs">
  {#each tabs as name}
    <li class="nav-item">
      <a
        class={`nav-link ${name === tab ? 'active' : ''}`}
        href={rel ? `${rel}/${name}` : name}>{capitalize(name)}</a
      >
    </li>
  {/each}
</ul>
