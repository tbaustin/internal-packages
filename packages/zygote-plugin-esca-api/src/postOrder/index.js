
export function postOrder({ response: { paid } }) {
	const success = Object.values(paid).every(val => val === true)
	return { success }
}
