<script lang="ts">
  import fromNow from 'fromnow'
  import { readable } from 'svelte/store'

  export let date: Date

  $: age = readable('', (set) => {
    set(fromNow(date, { suffix: true }))

    const interval = setInterval(
      () => set(fromNow(date, { suffix: true })),
      30 * 1000
    )

    return () => clearInterval(interval)
  })
</script>

{$age}
