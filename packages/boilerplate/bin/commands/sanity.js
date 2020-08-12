const { notify, warn } = require(`./../utils`)
const createSanityConfig = require(`./../create-sanity-config`)


exports.command = `sanity`
exports.describe = `Creates sanity.json file in CMS folder based on site config`


exports.handler = async () => {
	try {
		notify(`Creating Sanity config...`)
		await createSanityConfig()
		notify(`Sanity config created!\n`)
	}
	catch(err) {
		warn(`Unable to create Sanity config. See below.\n`)
		console.error(err)
		warn(`\nExiting...\n`)
		process.exit(1)
	}
}
