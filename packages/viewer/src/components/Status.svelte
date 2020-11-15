<script lang="ts">
  import context from '../context'

  const { deduction } = context()

  let progress: number | null = null
  let checked = 0
  let total = 0

  let timeout: NodeJS.Timeout

  deduction.subscribe((state) => {
    checked = state.checked.size
    total = state.all.size

    progress = (checked * 100.0) / total

    if (checked === total) {
      // Give the animation time to visually finish
      timeout = setTimeout(() => (progress = null), 1000)
    } else if (timeout) {
      clearTimeout(timeout)
    }
  })
</script>

<section class="status">
  {#if progress}
    <div class="progress">
      <div
        class="progress-bar"
        role="progressbar"
        style="width: {progress}%"
        aria-valuenow={checked}
        aria-valuemin="0"
        aria-valuemax={total} />
    </div>
  {/if}
</section>
