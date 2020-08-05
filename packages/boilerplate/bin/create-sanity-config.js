const { outputFile } = require(`fs-extra`)
const dirs = require(`./../dirs`)
const siteConfig = require(`${dirs.site}/config`)
const baseSanityConfig = require(`${dirs.cms}/sanity-config`)


const output = {
	root: true,
	api: {
		projectId: siteConfig.sanityProjectId,
		dataset: siteConfig.sanityDataset,
	},
	project: {
		name: siteConfig.sanityName,
		basePath: `/admin`,
	},
	...baseSanityConfig,
}


module.exports = function createSanityConfig() {
  const str = JSON.stringify(output, null, 3)
  return outputFile(`${dirs.cms}/sanity.json`, str)
}
