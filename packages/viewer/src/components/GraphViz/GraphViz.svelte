<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import * as d3 from 'd3'
  import * as graphviz from 'd3-graphviz'
  export let dot = 'digraph  {a -> b}'
  let graphDiv: HTMLElement
  const renderer = (dot: string) => {
    return () => {
      try {
        d3.select(graphDiv).graphviz().renderDot(dot)
      } catch {
        d3.select(graphDiv)
          .graphviz()
          .renderDot(
            `digraph {A[label="Invalid dot code",color=red,fontcolor=red]}`,
          )
      }
    }
  }
  onMount(renderer(dot))
  $: if (graphDiv) {
    renderer(dot)()
  }
</script>

<div bind:this={graphDiv} style="text-align: center;" />
