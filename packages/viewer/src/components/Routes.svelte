<script lang="ts">
  import { Route } from 'svelte-routing'

  import Home from './Home.svelte'

  import * as Dev from './Dev'
  import * as Properties from './Properties'
  import * as Theorems from './Theorems'
</script>

<Route path="/properties" component={Properties.List} />
<Route path="/properties/:id" component={Properties.Show} />
<Route path="/theorems" component={Theorems.List} />
<Route path="/theorems/:id" component={Theorems.Show} />
<Route path="/dev" component={Dev.Settings} />
<Route path="/dev/preview" component={Dev.Preview} />
<Route path="/" component={Home} />
