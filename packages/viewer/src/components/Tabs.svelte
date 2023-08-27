<script lang="ts">
  /**
   * Renders tab headers for a set of navigatable subtabs.
   *
   * If the current path ends with a part matching a tab name, that tab displays
   * as active, and clicking tabs toggles between siblings. Otherwise, the first
   * tab in the list is active, and clicking a tab navigates into a child path.
   *
   * KLUDGE – the user has to make sure that the default +page actually matches
   * the first tab in the list, and has to duplciate that +page. Something like
   *
   *   <Tabs tabs={{foo: Foo, bar: Bar} initial="foo" />}
   *
   * would feel better, but it's unclear how to reconcile that with the
   * filesystem-based router, provided we want each individual tab to be
   * routeable.
   */
  import { page } from '$app/stores'

  export let tabs: string[]

  $: parts = $page.url.pathname.split('/') ?? []
  $: last = parts[parts.length - 1]

  $: active = tabs.includes(last) ? last : tabs[0]
  $: base = tabs.includes(last) ? '' : `${$page.url.pathname}/`

  function capitalize(s: string) {
    return s.charAt(0).toUpperCase() + s.slice(1)
  }
</script>

<ul class="nav nav-tabs">
  {#each tabs as tab}
    <li class="nav-item">
      <a
        class={`nav-link ${active === tab ? 'active' : ''}`}
        href={`${base}${tab}`}>{capitalize(tab)}</a
      >
    </li>
  {/each}
</ul>
