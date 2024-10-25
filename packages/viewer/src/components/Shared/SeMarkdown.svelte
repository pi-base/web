<script lang="ts">
  import { Ref } from '@pi-base/core'

  export let source: string
  const modify = (s: string) => {
    const singlecurly = /{(?<type>[SPT])(?<id>\d+)}/g
    const doublecurlies = /{{(?<prefix>\w+):(?<id>[^{]+)}}/g

    // Replace double curly braces
    s = s.replace(doublecurlies, (_, prefix, id) => {
      // Perform replacement based on prefix and id
      const ref = Ref.format({
        kind: prefix,
        id: id,
      })
      return `[${ref.title}](${ref.href})`
    })

    // Replace single curly braces
    /*s = s.replace(singlecurly, (_, type, id) => {
      // Perform replacement based on type and id
      if (type.equals("S")) {
        return `[https://topology.pi-base.org/spaces/${type}${id}]()`
      } else if (type.equals("P")) {
        return `[https://topology.pi-base.org/properties/${type}${id}]()`
      } else {
        return `[https://topology.pi-base.org/theorems/${type}${id}]()`
      }
    })*/

    return s
  }
</script>

<h4>StackExchange Markdown</h4>
<pre>
{modify(source)}
</pre>
