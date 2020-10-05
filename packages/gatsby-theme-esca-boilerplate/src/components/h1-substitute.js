import React from 'react'


export default function H1Substitute(props) {
  const { className: parentClassName, ...other } = props
  const className = `h1-substitute ${parentClassName || ``}`

  return (
    <span className={className} {...other} />
  )
}
