<script lang="ts">
  import { onMount } from 'svelte'
  import context from '@/context'

  const { errorHandler } = context()

  let location: Location = window.location

  onMount(() => {
    location = window.location

    errorHandler(new Error('Not Found'), { location })
  })
</script>

<div class="wide jumbotron">
  <div class="container">
    <h1><code>404</code> Not Found</h1>
    <p>
      You appear to be looking for
      {' '}
      <code>{location.pathname}</code>, but no matching page was found.
    </p>
    <p>
      If this is a bug, please help out by
      <a
        href="https://github.com/pi-base/web/issues/new?title=Could not find {location.pathname +
          location.search}&body=If possible, add a description of how you got to this page, and what you'd expect to find here."
      >
        reporting it
      </a>.
    </p>
  </div>
</div>
