require(`dotenv`).config()

import cmsSync from './index'
import dirs from '../../boilerplate/dirs.json'
const siteConfig = require(`${dirs.site}/config`)

const { sanityProjectId, sanityDataset, apiStages, escaladeSite } = siteConfig 

cmsSync({
  sanityConfig: { projectId: sanityProjectId, dataset: sanityDataset },
  apiKey: process.env[apiStages.products === `prod` ? `X_API_KEY` : `X_API_KEY_TEST`],
  sanityKey: process.env.SANITY_TOKEN,
  site: escaladeSite,
})
