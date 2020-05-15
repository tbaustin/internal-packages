if (typeof window !== `undefined`) {
	const existingScript = document.getElementById(`polyfill`)

	if (!existingScript) {
		const script = document.createElement(`script`)
		script.src = `https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.findIndex%2CString.prototype.startsWith`
		script.id = `polyfill`
		document.body.appendChild(script)
	}
}

export { preInfo } from './preInfo'
export { postInfo } from './postInfo'
export { preOrder } from './preOrder'
export { postOrder } from './postOrder'
export { calculateTax } from './calculateTax'