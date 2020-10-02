import React from 'react'
import Accordion, { AccordionItem } from '../../../components/accordion'
import FilterWidget from '../../FilterWidget'
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

  return (
    <div css={getStyles(mobile)}>
      <Accordion condensed>
        {filterValues.map((filter, i) => {
          const headingText = filter?.title || ``
          const headingElement = (
            <span className="filterHeading">
              {headingText}
            </span>
          )
          const key = `filters-${headingText}-${i}`

          return (
            <AccordionItem key={key} id={key} heading={headingElement}>
              <FilterWidget
                filter={filter}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
              />
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}
