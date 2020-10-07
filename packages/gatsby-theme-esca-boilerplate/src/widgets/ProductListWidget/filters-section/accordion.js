import React, { useMemo } from 'react'
import Accordion, { AccordionItem } from '../../../components/accordion'
import FilterWidget from '../../FilterWidget'


export default function FiltersAccordion(props) {
  const { mobile, filterValues, activeFilters, setActiveFilters } = props

  const itemKeys = useMemo(() => {
    return filterValues.map((val, idx) => {
      return `filters-${val?.title}-${idx}`
    })
  }, [])

  const preExpanded = mobile ? [] : itemKeys.slice(0, 8)

  return (
    <Accordion condensed preExpanded={preExpanded}>
      {filterValues.map((filter, i) => {
        const headingText = filter?.title || ``
        const headingElement = (
          <span className="filterHeading">
            {headingText}
          </span>
        )
        const key = itemKeys?.[i]

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
  )
}
