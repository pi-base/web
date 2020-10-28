<script lang="ts">
  import { Link } from 'svelte-routing'

  import { contributingUrl } from '../constants'
</script>

<div class="wide jumbotron home-jumbotron">
  <div class="container">
    <h1>π-Base</h1>
    <p>a community database of topological counterexamples</p>
    <p>
      ➜ Search by property, such as
      <Link
        to="/spaces?q=compact%20%2B%20connected%20%2B%20t_2%20%2B%20~metrizable">
        non-metric continua
      </Link>
    </p>
    <p>
      ➜ Find spaces by name, such as
      <Link href="/spaces?text=compactification">compactifications</Link>
    </p>
    <p>
      ➜ View counterexamples to the converse of a theorem, such as
      <Link href="/theorems/T000112">T₅ ⇒ T₄</Link>
    </p>
  </div>
</div>

<h2>Contributing</h2>
<p>
  The π-Base relies on volunteers like yourself to submit new spaces,
  properties, and theorems. More information may be found on our
  <a href={contributingUrl}>Contributing</a>
  page.
</p>
<p>
  π-Base’s
  <a href="https://github.com/pi-base/data">data</a>
  and
  <a href="https://github.com/pi-base/viewer">source code</a>
  are available on GitHub. Code contributions are welcomed as well!
</p>
<h2>About Us</h2>
<p>
  The π-Base was founded in 2014 by
  <a href="https://github.com/jamesdabbs">James Dabbs</a>, who continues to
  maintain the project and serve as its main developer.
</p>
<p>
  <a href="https://github.com/stevenclontz">Steven Clontz</a>
  joined the project in 2017, serving as its lead mathematical editor.
</p>
<h2>Acknowledgements</h2>
<p>
  Many people have contributed to this project, and all contributions are
  appreciated, but a few individuals deserve special recognition:
</p>
<ul>
  <li>
    <a href="http://www.montevallo.edu/staff-bio/scott-varagona/">Scott Varagona</a>
    for his heroic work entering data into the database
  </li>
  <li>
    Our graduate advisor,
    <a href="http://www.auburn.edu/~gruengf/">Gary Gruenhage</a>
    for all his support and guidance
  </li>
  <li>
    <a href="http://austinmohr.com/home/">Austin Mohr</a>
    for his work using the π-Base as a pedagogical tool, and all his invaluable
    feedback
  </li>
  <li>
    The
    <a href="https://www.southalabama.edu/">University of South Alabama</a>{' '}
    Faculty Development Program for providing funding to host the π-Base server.
  </li>
  <li>
    Steen and Seebach for writing
    <a
      href="http://www.amazon.com/Counterexamples-Topology-Dover-Books-Mathematics/dp/048668735X">
      Counterexamples in Topology</a>
    in the first place and inspiring this project.
  </li>
</ul>
