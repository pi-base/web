<script lang="ts">
  import { Ref } from '@pi-base/core'
  import context from '@/context'
  const { spaces, theorems, properties, traits } = context()

  export let source: string
  const modify = (s: string) => {
    const internal_trait = /{S(?<spaceID>\d+)\|P(?<propID>\d+)}/g
    const internal_SPT = /{(?<type>[SPT])(?<id>\d+)}/g
    const external = /{{(?<prefix>\w+):(?<id>[^{]+)}}/g

    // Replace double curly braces
    s = s.replace(external, (_, prefix, id) => {
      // Perform replacement based on prefix and id
      const ref = Ref.format({
        kind: prefix,
        id: id,
      })
      return `[${ref.title}](${ref.href})`
    })

    // Replace single curly braces - check traits, then space/property/theorem
    // Reuses logic from https://github.com/pi-base/web/blob/0c340a5e5c400047acd21acc1ea7a3f75c06733d/packages/viewer/src/parser/internalLinks.ts
    // TODO: replace duplicate code
    s = s.replace(internal_trait, (_, sid, pid) => {
      const space = $spaces.find(Number(sid))
      const property = $properties.find(Number(pid))
      const trait = space && property && $traits.find(space, property)
      const connector =
        trait?.value === true ? 'is' : trait?.value === false ? 'is not' : '?'
      return `[S${sid}|P${pid}: ${
        space ? space.name : 'S' + sid
      } ${connector} ${
        property ? property.name : 'P' + pid
      }](https://topology.pi-base.org/spaces/S${sid}/properties/P${pid})`
    })
    s = s.replace(internal_SPT, (_, type, id) => {
      // Perform replacement based on type and id

      if (type === 'S') {
        const name = $spaces.find(`S${id}`)?.name
        return `[S${id}: ${name}](https://topology.pi-base.org/spaces/S${id})`
      } else if (type === 'P') {
        const name = $properties.find(`P${id}`)?.name
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
