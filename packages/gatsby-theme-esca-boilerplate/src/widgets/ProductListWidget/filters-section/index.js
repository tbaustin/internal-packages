import React from 'react'
import Lightbox from './lightbox'
import FiltersAccordion from './accordion'
import useFilterValues from './use-filter-values'
import { useFilterAndSort } from '../filter-and-sort-context'
import getStyles from './styles'


export default function FiltersSection(props) {
  const { mobile, filterSettings } = props

  const { products, filters, actions } = useFilterAndSort()

  const filterValues = useFilterValues({
    initFilters: filterSettings,
    products
  })
  
  if (!filterValues?.length) return null

  return (
    <div css={getStyles(mobile)}>
      <FiltersAccordion
        mobile={mobile}
        filterValues={filterValues}
        activeFilters={filters}
        setActiveFilters={actions.filterProducts}
      />
    </div>
  )
}


export function LightboxFiltersSection(props) {
  const { active, onClose, ...other } = props

  return (
    <Lightbox active={active} onClose={onClose}>
      <FiltersSection mobile {...other} />
    </Lightbox>
  )
}
