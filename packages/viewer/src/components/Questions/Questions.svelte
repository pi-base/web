<script lang="ts">
  import type { Space, Property, Trait } from '@/types'
  import { Dice } from '../Shared/Icons'
  import Typeset from '../Shared/Typeset.svelte'
  import context from '@/context'
  const { spaces, traits } = context()
  let openQuestion:
    | { space: Space; property: Property; trait: Trait | undefined }
    | undefined = undefined
  // Datasets with no undecided (space, property) pairs have no questions to
  // roll; openQuestion stays undefined and we render the empty state instead
  const rollOpenQuestion = () => {
    const openQuestions = $spaces.all.flatMap(space =>
      $traits
        .forSpaceAll(space)
        .filter(([, trait]) => trait === undefined)
        .map(([property, trait]) => ({ space, property, trait })),
    )
    openQuestion =
      openQuestions[Math.floor(Math.random() * openQuestions.length)]
  }
  rollOpenQuestion()
  $: bodyMain = `Does {S${openQuestion?.space.id}} satisfy {P${openQuestion?.property.id}}?`
  $: bodySecondary = `Trait link: {S${openQuestion?.space.id}|P${openQuestion?.property.id}}`
</script>

<div class="text-center my-3">
  {#if openQuestion}
    <div class="mb-3">
      <button
        type="button"
        class="btn btn-outline-secondary"
        on:click={() => rollOpenQuestion()}
      >
        <Dice /> Reroll question
      </button>
    </div>
    <div class="lead mb-3" style="font-size:2em">
      <Typeset body={bodyMain} />
    </div>
    <div class="mb-3">
      <Typeset body={bodySecondary} />
    </div>
    <p>
      <small> Disclaimer: some questions cannot be answered in ZFC! </small>
    </p>
  {:else}
    <p class="lead">There are no open questions in this database.</p>
  {/if}
</div>
