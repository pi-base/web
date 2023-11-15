<script lang="ts">
  import { onMount } from 'svelte'
  import * as d3 from 'd3'
  import type { Property, Theorem } from '@/models'
  import type { Writable } from 'svelte/store'

  import {
    type Node,
    type Link,
    type Graph,
    drawLinkWithMidpoint,
    renderLatex,
    pin,
  } from './graph'

  export let selected: Writable<Property | Theorem>
  export let graph: Graph

  let el: SVGSVGElement

  const width = 600
  const height = 600

  // Assumptions will be snapped to x = -bound, while the derived trait
  // will be located at x = +bound
  const bound = 200

  // Maximum width of node label text
  const textWidth = 500

  $: pin(graph, bound)

  onMount(() => {
    const color = d3.scaleOrdinal(d3.schemeTableau10)

    const simulation = d3
      .forceSimulation(graph.nodes)
      // Space out properties
      .force(
        'charge',
        d3.forceManyBody<Node>().strength(d => -100 * (d.pinned ? 10 : 3)),
      )
      // Keep linked properties close together
      .force(
        'link',
        d3.forceLink<Node, Link>(graph.links).id(d => d.property.id.toString()),
      )

    // Setup the SVG palette and primary shape types
    const svg = d3
      .select(el)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [-width / 2, -height / 2, width, height])
      .attr('style', 'max-width: 100%; width: 100%; height: 100%;')

    // Labeling property nodes is tricky, for a few reasons:
    //
    // While we'd _like_ labels to be middle-anchored text nodes, if we want
    // them to contain katex-rendered math, we need to attach foreignObjects to
    // hold HTML nodes.
    //
    // Because we can't middle-anchor those nodes, we kludge around it by
    // providing the foreignObjects with a generous bounding box and
    // text-aligning inside them.
    //
    // We _don't_ want these bounding boxes to intercept clicks or mouseovers on
    // the graph, so we have to keep them first in SVG document order.
    const text = svg
      .append('g')
      .attr('class', 'labels')
      .selectAll('foreignObject')
      .data(graph.nodes)
      .enter()
      .append('foreignObject')
      .attr(
        'requiredFeatures',
        'http://www.w3.org/TR/SVG11/feature#Extensibility',
      )
      .attr('width', `${textWidth}px`)
      .attr('height', '2em')

    text
      .append('xhtml:div')
      .html(d => (d.degree > 2 || d.pinned ? renderLatex(d.property.name) : ''))
      .style('width', '100%')
      .style('text-align', 'center')

    // Draw edges connecting properties which are related by a theorem
    const link = svg
      .append('g')
      .attr('stroke', '#777')
      .attr('stroke-opacity', 0.6)
      .selectAll('path')
      .data(graph.links)
      .join('path')
      .attr('stroke-width', 2)
      .attr('marker-mid', 'url(#arrowhead)')

    link.append('title').text(d => d.theorem.name)

    // Draw nodes for each property
    const node = svg
      .append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .enter()
      .append('circle')
      .attr('stroke', '#888')
      .attr('stroke-width', d => (d.pinned ? 3 : 1.5))
      .attr('r', d => {
        if (d.pinned) {
          return 10
        } else if (d.degree > 2) {
          return 8
        } else {
          return 5
        }
      })
      .attr('fill', d => (d.pinned || d.degree > 2 ? color('1') : color('2')))

    node.append('title').text(d => d.property.name)

    // Run the simulation and update elements
    simulation.on('tick', () => {
      link.attr('d', drawLinkWithMidpoint)

      node.attr('cx', ({ x }) => x ?? null).attr('cy', ({ y }) => y ?? null)

      // Position labels just under their corresponding nodes, and shifted so
      // that centered internal text will appear middle-anchored
      text
        .attr('x', ({ x }) => (x ? x - textWidth / 2 : null))
        .attr('y', ({ y }) => (y ? y + 8 : null))
    })

    // Allow hover-over
    node.on('mouseover', function () {
      const datum = d3.select(this).datum() as { property: Property }
      if (datum.property) {
        $selected = datum.property
      }
    })

    link.on('mouseover', function () {
      const datum = d3.select(this).datum() as Link
      if (datum.theorem) {
        $selected = datum.theorem
      }
    })

    // Allow dragging non-pinned nodes

    type DragEvent = d3.D3DragEvent<HTMLElement, unknown, Node>

    node.call(
      d3
        .drag<any, Node, unknown>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended),
    )

    function dragstarted({ active, subject }: DragEvent) {
      if (!active) {
        simulation.alphaTarget(0.3).restart()
      }

      subject.fx = subject.pinned?.x || subject.x
      subject.fy = subject.pinned?.y || subject.y
    }

    function dragged({ subject, x, y }: DragEvent) {
      subject.fx = subject.pinned?.x || x
      subject.fy = subject.pinned?.y || y
    }

    function dragended({ active, subject }: DragEvent) {
      if (!active) {
        simulation.alphaTarget(0)
      }

      subject.fx = subject.pinned?.x
      subject.fy = subject.pinned?.y
    }
  })
</script>

<svg xmlns="http://www.w3.org/2000/svg" bind:this={el}>
  <defs>
    <marker
      id="arrowhead"
      markerWidth="3"
      markerHeight="3"
      refX="0"
      refY="1.5"
      orient="auto"
    >
      <polygon points="0,0 3,1.5 0,3" fill="#888" />
    </marker>
  </defs>
</svg>
