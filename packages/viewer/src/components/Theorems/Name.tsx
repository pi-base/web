import React from 'react'
import { Link } from 'react-router-dom'


import { Theorem } from '../../models'
import paths from '../../paths'
import Formula from '../Shared/Formula'

interface Props {
  theorem: Theorem
  link?: 'theorem' | 'property' | 'none'
}

const Render = ({ theorem, link = 'none' }: { theorem: Theorem, link?: 'property' | 'none' }) =>
  (
    <>
      <Formula value={theorem.when} link={link} />
      {' ⇒ '}
      <Formula value={theorem.then} link={link} />
    </>
  )

export default function Name({
  theorem,
  link
}: Props) {
  if (link === 'theorem') {
    return (
      <Link to={paths.theorem(theorem)}>
        <Render theorem={theorem} />
      </Link>
    )
  } else {
    return (
      <Render theorem={theorem} link={link} />
    )
  }
}
