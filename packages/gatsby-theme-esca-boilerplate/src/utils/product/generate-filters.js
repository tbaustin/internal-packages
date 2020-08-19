export default function (filters, products, templateEngine, initFilters) {
	const { priceFilter, ratingFilter, stockFilter } = initFilters

	const staticFilters = []

	if(priceFilter) {
		staticFilters.push({
			title: `Price`,
			filterWidget: `FilterRange`,
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
			filterWidget: `FilterBoolean`,
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