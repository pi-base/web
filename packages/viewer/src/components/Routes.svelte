<script lang="ts">
  import { Route } from 'svelte-routing'

  import * as Dev from './Dev'
  import Home from './Home.svelte'
  import * as Properties from './Properties'
  import Search from './Search'
  import * as Spaces from './Spaces'
  import * as Traits from './Traits'
  import * as Theorems from './Theorems'
</script>

<Route path="/spaces" component={Search} />
<Route path="/spaces/:spaceId/properties/:propertyId" component={Traits.Show} />
<Route path="/spaces/:id/*" component={Spaces.Show} />
<Route path="/properties" component={Properties.List} />
<Route path="/properties/:id/*" component={Properties.Show} />
<Route path="/theorems" component={Theorems.List} />
<Route path="/theorems/:id/*" component={Theorems.Show} />
<Route path="/dev" component={Dev.Settings} />
<Route path="/dev/preview" component={Dev.Preview} />
<Route path="/" component={Home} />
