<script lang="ts">
  // @ts-nocheck
  import { onMount } from 'svelte'
  import * as d3 from 'd3'
  import * as graphviz from 'd3-graphviz'
  export let dot = 'digraph  {a -> b}'
  let graphDiv: HTMLElement
  onMount(() => {
    d3.select(graphDiv).graphviz().renderDot(dot)
  })
  $: if (graphDiv) {
    d3.select(graphDiv).graphviz().renderDot(dot)
  }
</script>

<div bind:this={graphDiv} style="text-align: center;" />
