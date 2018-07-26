import { State } from 'statable'
import fetch from 'isomorphic-fetch'

const state = new State({}, {
	fetch: async function (options) {
		if (!options.site) {
			console.log(`Warning: No site option set.`)
		}
		let ids = []
		if (options.ids) {
			ids.push(...options.ids)
		}
		if (options.id) {
			ids.push(options.id)
		}
		if (!ids.length) {
			return
		}


		let body = JSON.stringify({
			site: options.site,
			ids,
		})
		console.log(`Fetching...`)
		let res = await fetch(options.endpoint, {
			method: 'POST',
			body,
		})
		res = await res.json()
		console.log(res)
		this.setState(res)

		// Repoll interval
		if (typeof window === 'object') {
			clearTimeout(this.timeout)
			this.timeout = setTimeout(() => {
				this.fetch({
					...options,
					ids: Object.keys(this.state)
				})
			}, 60 * 1000)
		}
	}
})
export default state