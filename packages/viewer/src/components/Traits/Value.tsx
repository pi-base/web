import React from 'react'
import { FaCheck, FaTimes, FaQuestion } from 'react-icons/fa'

export default function Value({ value }: { value: boolean | undefined }) {
  const props = {
    style: { marginRight: '0.4em' }
  }

  if (value === false) {
    return <FaTimes {...props} />
  } else if (value === undefined) {
    return <FaQuestion {...props} />
  } else {
    return <FaCheck {...props} />
  }
}
