const postOrder = async (data) => {
	console.log(`PostOrder: `, data)

	return {
		order: {
			status: `success`,
		},
	}
}

export { postOrder }
