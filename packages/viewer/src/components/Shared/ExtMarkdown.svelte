<script lang="ts">
  import { Ref } from '@pi-base/core'
  import context from '@/context'
  const { spaces, theorems, properties } = context()=

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
    s = s.replace(singlecurly, (_, type, id) => {
      // Perform replacement based on type and id

      if (type === 'S') {
        const name = $spaces.find(`S${id}`)?.name
        return `[S${id}: ${name}](https://topology.pi-base.org/spaces/S${id})`
      } else if (type === 'P') {
        const name = $properties.find(`T${id}`)?.name
        return `[P${id}: ${name}](https://topology.pi-base.org/properties/P${id})`
      } else {
        const name = $theorems.find(`T${id}`)?.name
        return `[T${id}: ${name}](https://topology.pi-base.org/theorems/T${id})`
      }
    })

    return s
  }
</script>

<h4>External Markdown</h4>
<pre>
{modify(source)}
</pre>
