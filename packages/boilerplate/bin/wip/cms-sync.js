require(`dotenv`).config()
const cmsSync = require(`@escaladesports/cms-sync`).default

const { sanityProjectId, sanityDataset, apiStages, escaladeSite } = require(`../config`)

cmsSync({
	sanityConfig: { projectId: sanityProjectId, dataset: sanityDataset },
	apiKey: process.env[apiStages.products === `prod` ? `X_API_KEY` : `X_API_KEY_TEST`],
	sanityKey: process.env.SANITY_TOKEN,
	site: escaladeSite,
})
