
export function preInfo({ info }) {
	const skus = info?.products?.map?.(p => p.id) || []
	return { skus }
}
