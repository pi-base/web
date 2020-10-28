<script lang="ts">
  import { Route } from 'svelte-routing'

  import Home from './Home.svelte'

  import * as Dev from './Dev'
  import * as Properties from './Properties'
</script>

<Route path="/properties" component={Properties.List} />
<Route path="/properties/:id" component={Properties.Show} />
<Route path="/dev" component={Dev.Settings} />
<Route path="/dev/preview" component={Dev.Preview} />
<Route path="/" component={Home} />
