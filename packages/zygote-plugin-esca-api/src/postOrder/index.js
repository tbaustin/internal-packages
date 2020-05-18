const postOrder = async ( { response: { paid } }) => {
	console.log(`PostOrder: `, paid)
	let success = Object.values(paid).every(value => value === true)
	return {
		success,
	}
}

export { postOrder }
