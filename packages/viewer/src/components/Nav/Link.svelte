<script type="ts">
  import { Link } from 'svelte-routing'

  export let to: string
</script>

<Link {to} getProps={() => ({ class: 'nav-link' })}>
  <slot />
</Link>
