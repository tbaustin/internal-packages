// import * as Sentry from '@sentry/browser'
// import { settingsState } from '@escaladesports/zygote-cart/dist/state'

if (typeof window !== 'undefined') {
	const existingScript = document.getElementById('polyfill')

	if (!existingScript) {
		const script = document.createElement('script')
		script.src = 'https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.findIndex%2CString.prototype.startsWith'
		script.id = 'polyfill'
		document.body.appendChild(script)
	}
}

export * from './info'
export * from './order'
export * from './tax'