export default (sku) => {
	return sku.replace(/[^a-zA-Z0-9._-]/g, `-`)
}