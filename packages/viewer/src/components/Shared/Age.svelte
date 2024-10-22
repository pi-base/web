<script lang="ts">
  import fromNow from 'fromnow'
  import { readable } from 'svelte/store'

  export let date: Date

  $: age = readable('', set => {
    set(fromNow(date, { suffix: true }))

    const interval = setInterval(
      () => set(fromNow(date, { suffix: true })),
      30 * 1000,
    )

    return () => clearInterval(interval)
  })

  let klass:string = ""
  const DAY = 1000 * 60 * 60 * 24
  const WEEK = DAY * 7
  
  $: if (Date.now() > new Date(date).getTime() + WEEK) {
    klass = "text-danger"
  } else if (Date.now() > new Date(date).getTime() + DAY) {
    klass = "text-warning"
  } else {
    klass = "text-info"
  }
</script>

<span class={klass}>{$age}</span>
