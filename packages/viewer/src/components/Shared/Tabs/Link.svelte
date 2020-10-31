<script lang="ts">
  import { Link } from 'svelte-routing'
  import { getContext } from 'svelte'

  export let to: string

  const initial = getContext('TABS.INITIAL')

  function getProps({
    isCurrent,
    href,
    location,
  }: {
    isCurrent: boolean
    href: string
    location: Location
  }) {
    const active =
      isCurrent || (to === initial && href === `${location.pathname}/${to}`)
    return {
      class: `nav-link ${active ? 'active' : ''}`,
    }
  }
</script>

<li class="nav-item">
  <Link {to} {getProps}>
    <slot />
  </Link>
</li>
