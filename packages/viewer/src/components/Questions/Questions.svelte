<script lang="ts">
  import type { Space, Property, Trait } from '@/types'
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
</script>

Does {openQuestion?.space.name} satisfy {openQuestion?.property.name}?
