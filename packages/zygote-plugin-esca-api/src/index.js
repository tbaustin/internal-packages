// import * as Info from './info'
// import * as Order from './order'
// import * as Tax from './tax'

// const Api = {
// 	Info, Order, Tax
// }

// export default Api

if (typeof window !== 'undefined') {
	const existingScript = document.getElementById('polyfill')

	if (!existingScript) {
		const script = document.createElement('script')
		script.src = 'https://polyfill.io/v3/polyfill.min.js?features=String.prototype.startsWith'
		script.id = 'polyfill'
		document.body.appendChild(script)
	}
}

export * from './info'
export * from './order'
export * from './tax'