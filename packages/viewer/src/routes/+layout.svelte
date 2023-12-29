<script lang="ts">
  import 'bootstrap/dist/css/bootstrap.min.css'

  import { browser } from '$app/environment'

  import type { LayoutData } from './$types'

  import { bundleSse, defaultHost } from '@/constants'
  import { set } from '@/context'
  import { reset } from '@/util'

  import Nav from '@/components/Nav.svelte'
  import Status from '@/components/Status.svelte'
  import Footer from '@/components/Footer.svelte'

  export let data: LayoutData

  set(data)

  // HACK: the typsetter is a store derived from spaces / properties / theorems,
  // so that link rendering updates appropriately with new records. This
  // ensures that there is always at least one subscription to the derived store,
  // so that it doesn't get thrown away and rebuilt when the user happens to
  // navigate to a page without any rendered math.
  data.typeset.subscribe(() => {})

  if (browser && bundleSse) {
    new EventSource(`${defaultHost}/sse`).addEventListener(
      'bundle.reload',
      reset,
    )
  }
</script>

<Nav />
<Status />
<slot />
<Footer />
