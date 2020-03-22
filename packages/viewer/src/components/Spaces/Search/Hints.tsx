import React from 'react'

const examples = [
  {
    title: 'All Non-Metric Continua',
    query: 'compact + connected + t_2 + ~metrizable'
  },
  {
    title: 'A Common Non-Theorem',
    query: 'first countable + separable + ~second countable'
  }
]

export default function Hints({
  setSearch
}: {
  setSearch: (q: string) => void
}) {
  return (
    <>
      <p>
        <b>Not sure where to start?</b>
        {' '}
        Try one of the following searches:
      </p>
      {examples.map(({ title, query }) =>
        <article key={query}>
          <h5>{title}</h5>
          <pre
            className="example"
            onClick={() => setSearch(query)}
          >
            {query}
          </pre>
        </article>
      )}
    </>
  )
}
