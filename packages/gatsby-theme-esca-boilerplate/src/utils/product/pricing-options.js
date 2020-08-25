export default function(variants) {
	const prices = variants?.map?.(v => v?.price)
	const min = Math.min(...prices)
	const max = Math.max(...prices)
	const defaultPrice = prices?.[0]

	return {
		defaultVariant: defaultPrice,
		priceRange: min < max ? [min, max] : defaultPrice,
		priceLowest: min,
		priceHighest: max,
	}
}