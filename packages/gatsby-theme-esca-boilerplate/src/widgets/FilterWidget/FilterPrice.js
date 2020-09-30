import React from 'react'
import FilterRange from './FilterRange'


export default function FilterPrice(props) {
  return (
    <FilterRange
      placeholderFrom="$"
      placeholderTo="$$$"
      {...props}
    />
  )
}
