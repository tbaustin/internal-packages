const getVariantValues = (variants, templateEngine, patchedData, key, field) => {
	return variants.reduce((acc2, _, i) => {
		const valueOnVariant = templateEngine.resolveProperty(
			`Variants:${i + 1}:${field || ``}${key}`,
			patchedData,
		)

		if(valueOnVariant === 0 || valueOnVariant) {
			if(typeof valueOnVariant === `string` && !!valueOnVariant.length) {
				acc2.push(valueOnVariant)
			} else if(typeof valueOnVariant !== `string`) {
				acc2.push(valueOnVariant)
			}
		}
	
		return acc2
	}, [])
}

const isObject = (val) => {
	return typeof val === `object` && val !== null
}

export default function(activeFilters, products, templateEngine) {
	return products.filter(product => {
		const { patchedData } = templateEngine.patchCustomData(product)
			
		const { variants } = product

		const shouldShow = Object.keys(activeFilters).every(key => {
			const activeFilterValues = activeFilters[key]

			/*
			* This handles Filter List and Filter Swatch
			*/
			if(Array.isArray(activeFilterValues)) {
				if(!activeFilterValues.length) return true

				const variantValues = getVariantValues(
					variants, templateEngine, patchedData, key, `Custom Fields:`,
				)

				// check if at least on of the variant values exist in the active filter values
				return variantValues.some(v => activeFilterValues.indexOf(v) !== -1)
			}

			/*
			* This handles Filter Range
			*/
			if(isObject(activeFilterValues) && `min` in activeFilterValues && `max` in activeFilterValues) {
				const { min, max } = activeFilterValues
				const variantValues = getVariantValues(
					variants, templateEngine, patchedData, key,
				)

				return variantValues.some(v => v >= min && v <= max)
			}

			/*
			* This handles Filter Boolean
			*/
			if(typeof activeFilterValues === `boolean`) {
				const variantValues = getVariantValues(
					variants, templateEngine, patchedData, key,
				)

				console.log(`Variant Values: `, variantValues)

				return variantValues.some(v => !!v === activeFilterValues)
			}

			/*
			* This handles Filter Rating
			*/
			if(typeof activeFilterValues === `number`) {
				const variantValues = getVariantValues(
					variants, templateEngine, patchedData, key,
				)

				return variantValues.some(v => v >= activeFilterValues)
			}

			
		})
		
		return shouldShow
	})
}