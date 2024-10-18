<script lang="ts">
  export let source: string
  const modify = (s: string) => {
    const singlecurly = /{(?<type>[SPT])(?<id>\d+)}/g
    const doublecurlies = /{{(?<prefix>\w)+:(?<id>[^{])+}}/g

    // Replace single curly braces
    s = s.replace(singlecurly, (type, id) => {
      // Perform replacement based on type and id
      return `${type}, ${id}`
    })

    // Replace double curly braces
    s = s.replace(doublecurlies, (prefix, id) => {
      // Perform replacement based on prefix and id
      return `${prefix}, ${id}`
    })

    return s
  }
</script>

<h4>StackExchange Markdown</h4>
<pre>
{modify(source)}
</pre>
