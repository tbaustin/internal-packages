const cmsSync = require(`@escaladesports/cms-sync`).default
const { notify, warn } = require(`./../utils`)
const dirs = require(`./../../dirs`)
const siteConfig = require(`${dirs.site}/config`)

const { sanityProjectId, sanityDataset, apiStages, escaladeSite } = siteConfig

exports.command = `sync`
exports.describe = `Syncs Salsify products to Sanity`


exports.handler = async () => {
	try {
		notify(`Syncing products from Salisfy...`)
		await cmsSync({
			sanityConfig: { projectId: sanityProjectId, dataset: sanityDataset },
			apiKey: process.env[apiStages.products === `prod` ? `X_API_KEY` : `X_API_KEY_TEST`],
			sanityKey: process.env.SANITY_TOKEN,
			site: escaladeSite,
		})
		notify(`Products have been successfully synced from Salsify to Sanity\n`)
	}
	catch(err) {
		warn(`Unable to sync products. See below.\n`)
		console.error(err)
		warn(`\nExiting...\n`)
		process.exit(1)
	}
}
