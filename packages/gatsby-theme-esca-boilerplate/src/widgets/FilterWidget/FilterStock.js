import React from 'react'
import FilterBoolean from './FilterBoolean'


export default function FilterStock(props) {
  return <FilterBoolean {...props} label="In stock only" />
}
