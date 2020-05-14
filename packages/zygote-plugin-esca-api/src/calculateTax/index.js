export const calculateTax = async (data) => {

	console.log(`calculateTax`, data)
	return {
		id: `tax`,
		description: `Michigan Tax`,
		value: parseInt(10),
	}
}