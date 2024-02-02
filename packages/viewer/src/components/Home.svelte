<script lang="ts">
  import Cite from './Shared/Cite.svelte'

  import { contributingUrl } from '@/constants'
</script>

<div class="wide jumbotron home-jumbotron">
  <div class="container">
    <h1 class="display-4">π-Base</h1>
    <p class="lead">a community database of topological counterexamples</p>
    <div class="ml-3 mt-4">
      <p>
        ➜ Search spaces by name/description:
        <a href="/spaces?text=compactification" class="text-info"
          >compactifications</a
        >
      </p>
      <p>
        ➜ Search spaces by properties:
        <a
          href="/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable"
          class="text-info">non-metric continua</a
        >
      </p>
      <p class="mb-0">
        ➜ Find counterexamples:
        <a href="/theorems/T000021" class="text-info"
          >spaces with the countable chain condition need not be separable</a
        >
      </p>
    </div>
  </div>
</div>

<main class="container">
  <blockquote class="blockquote text-center mt-5 mb-5">
    <p class="mb-0">
      Topology is a dense forest of counterexamples. A usable map of the forest
      is a fine thing.
    </p>
    <footer class="blockquote-footer">
      Paraphrased from Mary Ellen Rudin's review of
      <cite title="Counterexamples in Topology"
        >Counterexamples in Topology</cite
      >
    </footer>
  </blockquote>
  <hr />
  <h3>Contributing</h3>
  <p>
    π-Base's data and software are open-sourced on <a
      href="https://github.com/pi-base/">GitHub</a
    >. We rely on
    <a href="https://github.com/pi-base/data/graphs/contributors"
      >volunteers like yourself</a
    >
    to <a href={contributingUrl}>contribute</a> new spaces, properties, and theorems.
  </p>
  <h3>About Us</h3>
  <p>
    The π-Base was founded in 2014 by its lead maintainer
    <a href="https://github.com/jamesdabbs">James Dabbs</a>. π-Base's lead
    mathematical editor and contributing research software engineer
    <a href="https://clontz.org">Steven Clontz</a>
    joined the project in 2017.
  </p>
  <h3>Community</h3>
  <p>
    The π-Base is part of the
    <a href="https://code4math.org" style="font-family:monospace">code4math</a>
    community. Join the conversation on either the
    <a href="https://code4math.zulipchat.com/">code4math Zulip</a>
    or the
    <a href="https://github.com/orgs/pi-base/discussions">
      π-Base GitHub Discussion board</a
    >.
  </p>
  <p>
    More databases may be discovered at the
    <a href="https://mathbases.org/">Index of Mathematical DataBases</a>.
  </p>
  <h3>Special Acknowledgements</h3>
  <p>
    Many people have contributed to this project, but a few individuals and
    organizations deserve particular recognition:
  </p>
  <ul>
    <li>
      Steen and Seebach for writing the inspiration for this project,
      <a href="https://en.wikipedia.org/wiki/Counterexamples_in_Topology">
        <cite>Counterexamples in Topology</cite></a
      >.
    </li>
    <li>
      <a href="http://www.montevallo.edu/staff-bio/scott-varagona/"
        >Scott Varagona</a
      >
      for his heroic work serializing <cite>Counterexamples</cite> into the first
      version of the π-Base.
    </li>
    <li>
      Steven and James' graduate advisor,
      <a href="http://www.auburn.edu/~gruengf/">Gary Gruenhage</a>, for all his
      support and guidance.
    </li>
    <li>
      <a href="http://austinmohr.com/home/">Austin Mohr</a>
      for his work and feedback using the π-Base as a pedagogical tool and promoting
      us on
      <a href="https://math.stackexchange.com">Math.StackExchange</a>.
    </li>
    <li>
      Funding from the <a href="https://www.southalabama.edu/"
        >University of South Alabama</a
      >
      Faculty Development Council from 2017-2018.
    </li>
  </ul>
</main>
<Cite />
