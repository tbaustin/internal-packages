export default function(variants, templateEngine, customVal) {
	const prices = variants?.map?.(v => v?.price)
	const salePrices = variants?.reduce?.((acc, cur) => {
		const salePrice = templateEngine.parse(
			customVal,
			cur,
		)
		return salePrice ? [...acc, +salePrice] : acc
	}, [])

	if(!prices || !prices.length) {
		// if there is no msrp then we don't want to show any price
		return {
			defaultVariant: null,
			priceRange: null,
			priceLowest: null,
			priceHighest: null,
			salePriceRange: null,
		}
	}

	const min = Math.min(...prices) 
	const max = Math.max(...prices) 
	const minSale = salePrices?.length ? Math.min(...salePrices) : 0
	const maxSale = salePrices?.length ? Math.max(...salePrices) : 0
	const defaultPrice = prices?.[0]

	return {
		defaultVariant: defaultPrice,
		priceRange: min < max ? [min, max] : defaultPrice,
		priceLowest: min,
		priceHighest: max,
		strikePriceRange: maxSale > max && minSale > min ? [minSale, maxSale] : null,
	}
}