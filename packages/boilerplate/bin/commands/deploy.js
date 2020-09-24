const { notify, warn } = require(`./../utils`)

const sync = require(`./sync`)
const build = require(`./build`)

exports.command = `deploy`
exports.describe = `Syncs Salsify products to Sanity and builds the site`


exports.handler = async () => {
	try {
		notify(`Started Site Deploy...`)
		await sync()
		await build()
		notify(`Site Deployed!`)
	}
	catch(err) {
		warn(`Unable to deploy site. See below.\n`)
		console.error(err)
		warn(`\nExiting...\n`)
		process.exit(1)
	}
}
