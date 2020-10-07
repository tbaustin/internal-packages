import React from 'react'
import FiltersModal from './modal'
import FiltersAccordion from './accordion'
import useFilterValues from './use-filter-values'
import getStyles from './styles'


export default function FiltersSection(props) {
  const {
    mobile,
    products,
    initFilters,
    activeFilters,
    setActiveFilters
  } = props

  const filterValues = useFilterValues({ products, initFilters })
  if (!filterValues?.length) return null

  const accordion = (
    <FiltersAccordion
      mobile={mobile}
      filterValues={filterValues}
      activeFilters={activeFilters}
      setActiveFilters={setActiveFilters}
    />
  )

  const accordionWithModal = (
    <FiltersModal>
      {accordion}
    </FiltersModal>
  )

  return (
    <div css={getStyles(mobile)}>
      {mobile ? accordionWithModal : accordion}
    </div>
  )
}
