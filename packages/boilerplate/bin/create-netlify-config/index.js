const { stringify } = require(`@iarna/toml`)
const { outputFile } = require(`fs-extra`)
const dirs = require(`./../../dirs`)
const { siteId } = require(`${dirs.site}/config`)
const apiRedirects = require(`./redirects-api`)
const adminRedirects = require(`./redirects-admin`)


const config = {
	Settings: {
		ID: siteId
	},
	build: {
		functions: `netlify-functions/dist/`
	},
	redirects: [
		...adminRedirects,
		...apiRedirects
	]
}


module.exports = function createNetlifyConfig() {
	const str = stringify(config)
	return outputFile(`${dirs.site}/netlify.toml`, str)
}
