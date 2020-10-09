import { useMemo } from 'react'
import { useTemplateEngine } from '../../../context/template-engine'



const generateFilters = (filters, products, templateEngine, initFilters) => {
	const { priceFilter, ratingFilter, stockFilter } = initFilters

	const staticFilters = []

	if(priceFilter) {
		staticFilters.push({
			title: `Price`,
			filterWidget: `FilterPrice`,
		})
	}
	if(ratingFilter) {
		staticFilters.push({
			title: `Rating`,
			filterWidget: `FilterRating`,
		})
	}
	if(stockFilter) {
		staticFilters.push({
			title: `Stock`,
			filterWidget: `FilterStock`
		})
	}

	/*
	 * Only works for FilterList for now
	*/
	const dynamicFilters = filters.reduce((acc, cur) => {
		const { title } = cur

		const filterValues = []

		products.forEach(product => {
			const { patchedData } = templateEngine.patchCustomData(product)

			const { variants } = product

			variants.forEach((_, i) => {
				const valueOnVariant = templateEngine.resolveProperty(
					`Variants:${i + 1}:Custom Fields:${title}`,
					patchedData,
				)

				if(valueOnVariant){
					const exist = filterValues.find(val => val === valueOnVariant)
					if(!exist) {
						filterValues.push(valueOnVariant)
					}
				}
			})
		})

		return [...acc, {...cur, values: filterValues }]

	}, [])

	return [...staticFilters, ...dynamicFilters]
}



export default function useFilterValues(options) {
  const { products, initFilters } = options

  const templateEngine = useTemplateEngine()

  return useMemo(() => {
    const customFields = templateEngine?.schema
      ?.find(type => type.name === `variant`)?.fields
      ?.find(field => field?.name === `customFields`)
      ?.fields || []

    const filters = customFields.filter(field => field?.filterWidget)

    return generateFilters(filters, products, templateEngine, initFilters)
  }, [])
}
