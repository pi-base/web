<script lang="ts">
  import { writable } from 'svelte/store'

  import context from '../context'

  const { deduction } = context()

  const progress = writable<number | null>(null)

  let timeout: NodeJS.Timeout
  deduction.subscribe(({ checked, total }) => {
    progress.set(((checked + 1) * 100.0) / $deduction.total)

    if (checked + 1 === total) {
      // Give the animation time to visually finish
      timeout = setTimeout(() => progress.set(null), 1000)
    } else if (timeout) {
      clearTimeout(timeout)
    }
  })
</script>

<section class="status">
  {#if $progress}
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        style="width: {$progress}%"
        aria-valuenow={$deduction.checked}
        aria-valuemin="0"
        aria-valuemax={$deduction.total} />
    </div>
  {/if}
</section>
