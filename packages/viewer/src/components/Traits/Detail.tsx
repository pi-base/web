import React from 'react'
import { Link } from 'react-router-dom'

import { Property, Space, Trait } from '../../models'
import paths from '../../paths'
import Description from '../Shared/Description'
import Inline from '../Shared/Inline'
import Proof from './Proof'

export default React.memo(
  function Detail({ property, space, trait }: {
    property: Property
    space: Space
    trait: Trait
  }) {
    return (
      <>
        <h1>
          <Link to={paths.space(space)}>
            <Inline body={space.name} />
          </Link>
          {trait.value
            ? ' is '
            : ' is not '}
          <Link to={paths.property(property)}>
            <Inline body={property.name} />
          </Link>
        </h1>

        {trait.proof
          ? <Proof space={space} proof={trait.proof} />
          : <Description body={trait.description} refs={trait.refs} />
        }
      </>
    )
  }
)
