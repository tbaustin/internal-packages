import React from 'react'


export default [
  { title: `Normal`, value: `normal` },
  { title: `Heading 1`, value: `h1` },
  {
    title: `Heading 1 (no h1 tag)`,
    value: `h1Substitute`,
    /* Visually mimic the regular "Heading 1" in editor */
    blockEditor: {
      render: props => (
        <span style={{ fontSize: `2rem`, fontWeight: 700 }}>
          {props.children}
        </span>
      )
    }
  },
  { title: `Heading 2`, value: `h2` },
  { title: `Heading 3`, value: `h3` },
  { title: `Heading 4`, value: `h4` }
]
