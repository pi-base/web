<script lang="ts">
  import type { Space, Property, Trait } from '@/types'
  import { Dice } from '../Shared/Icons'
  import Typeset from '../Shared/Typeset.svelte'
  import context from '@/context'
  const { spaces, traits } = context()
  let openQuestion:
    | { space: Space; property: Property; trait: Trait | undefined }
    | undefined = undefined
  const rollOpenQuestion = () => {
    openQuestion = undefined
    const ss = $spaces.all
    while (openQuestion == undefined) {
      const randomSpace = ss[Math.floor(Math.random() * ss.length)]
      const openQuestions = $traits
        .forSpaceAll(randomSpace)
        .map(([p, t]) => {
          return {
            space: randomSpace,
            property: p,
            trait: t,
          }
        })
        .filter(question => question.trait === undefined)
      if (openQuestions.length === 0) {
        openQuestion = undefined
      } else {
        openQuestion =
          openQuestions[Math.floor(Math.random() * openQuestions.length)]
      }
    }
  }
  rollOpenQuestion()
  $: bodyMain = `Does {S${openQuestion?.space.id}} satisfy {P${openQuestion?.property.id}}?`
  $: bodySecondary = `Trait link: {S${openQuestion?.space.id}|P${openQuestion?.property.id}}`
</script>

<div class="lead text-center my-3">
  <div class="mb-3">
    <button
      type="button"
      class="btn btn-outline-secondary"
      on:click={() => rollOpenQuestion()}
    >
      <Dice /> Reroll question
    </button>
  </div>
  <div class="mb-3" style="font-size:2em">
    <Typeset body={bodyMain} />
  </div>
  <div class="mb-3">
    <Typeset body={bodySecondary} />
  </div>
</div>
