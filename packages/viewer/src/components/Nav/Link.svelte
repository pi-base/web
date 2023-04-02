<script lang="ts">
  import { Link } from 'svelte-routing'

  export let to: string
  export let brand = false
</script>

<Link {to} getProps={() => ({ class: brand ? 'navbar-brand' : 'nav-link' })}>
  <slot />
</Link>
