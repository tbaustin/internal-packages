export default function(variants) {
	const prices = variants?.map?.(v => v?.price)
	const salePrices = variants?.reduce?.((acc, cur) => {
		const { customFieldEntries } = cur
		const salePrice = customFieldEntries?.find?.(f =>  f.fieldName === `Sale Price`)?.fieldValue?.number
		
		return salePrice ? [...acc, +salePrice] : acc
	}, [])

	const min = Math.min(...prices)
	const max = Math.max(...prices)
	const minSale = salePrices.length ? Math.min(...salePrices) : 0
	const maxSale = salePrices.length ? Math.max(...salePrices) : 0
	const defaultPrice = prices?.[0]

	return {
		defaultVariant: defaultPrice,
		priceRange: min < max ? [min, max] : defaultPrice,
		priceLowest: min,
		priceHighest: max,
		salePriceRange: maxSale > max && minSale > min ? [minSale, maxSale] : null,
	}
}