// NOTE: this will get rewritten as @sentry/browser when building for browser
import * as Sentry from '@sentry/browser'


const dsn = `https://e51b6f18c5cc485a9828f86e4e3ca8e4@sentry.io/3842502`
Sentry.init({ dsn, defaultIntegrations: false })


let fingerprint = Date.now().toString()

const flush = () => {
	fingerprint = Date.now().toString()
}


const send = (err, params) => {
	const { level, tags, extra } = params || {}

	Sentry.withScope(scope => {
		if (typeof tags === `object`) {
			Object.keys(tags).forEach(t => scope.setTag(t, tags[t]))
		}
		if (typeof extra === `object`) {
			Object.keys(extra).forEach(e => scope.setExtra(e, extra[e]))
		}
		scope.setFingerprint(fingerprint)
		scope.setLevel(level || `error`)
		Sentry.captureException(err)
	})
}


export default { flush, send, fingerprint }
