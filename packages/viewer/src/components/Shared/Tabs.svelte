<script lang="ts" generics="Tab extends string">
  import { capitalize } from '@/util'

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
