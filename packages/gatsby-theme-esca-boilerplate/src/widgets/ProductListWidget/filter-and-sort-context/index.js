import React, { createContext, useContext, useState } from 'react'
import { useTemplateEngine } from '../../../context/template-engine'
import applyFilters from './apply-filters'
import applySort from './apply-sort'



const FilterAndSortContext = createContext()
export const useFilterAndSort = () => useContext(FilterAndSortContext)


export default function Provider(props) {
  const { products } = props

	const [sortCriteria, setSortCriteria] = useState([])
  const [filters, setFilters] = useState({})

  const sortProducts = (...args) => setSortCriteria(args)
	const filterProducts = newFilters => setFilters(newFilters)

	const templateEngine = useTemplateEngine()

	const filteredProducts = applyFilters(filters, products, templateEngine)
	const filteredSortedProducts = applySort(filteredProducts, ...sortCriteria)

  const actions = { filterProducts, sortProducts }
  const contextValue = {
		products: filteredSortedProducts,
		filters,
		sortCriteria,
		actions
	}

  return (
    <FilterAndSortContext.Provider value={contextValue}>
      {props.children}
    </FilterAndSortContext.Provider>
  )
}
