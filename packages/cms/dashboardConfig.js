// const dirs = require(`@escaladesports/boilerplate/dirs`)
// const configPath = `${dirs.site}/config.js`
// const siteConfig = require(configPath)

export default {
	widgets: [
		{
			name: `netlify`,
			options: {
				title: `Netlify Deploys`,
				sites: [
					{
						title: `Sanity Studio`,
						// apiId: siteConfig.netlifyApiId,
						// buildHookId: siteConfig.netlifyBuildHookId,
						// name: siteConfig.siteId,
						apiId: `5da43aee-19c3-4b41-8d6d-f592e5cd3ba0`,
						buildHookId: `5f8468d0a642c9d7c1fb2277`,
						name: `lifeline-fitness`,
					},
				],
			},
		},
	],
}