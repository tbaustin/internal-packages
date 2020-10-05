const path = require(`path`)
const sanityClient = require(`@sanity/client`)
const developMiddleware = require(`./dev-middleware`)
const dirs = require(`@escaladesports/boilerplate/dirs`)
const configPath = `${dirs.site}/config.js`
const siteConfig = require(configPath)


const isDevMode = process.env.NODE_ENV === `development`

const { siteUrl } = siteConfig

module.exports = ({ icon }) => ({
	siteMetadata: {
		title: `Escalade Website Boilerplate`,
		description: `Test boilerplate website & CMS`,
		author: `@escaladesports`,
		siteUrl,
	},
	plugins: [
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-sitemap`,
		{
			resolve: `gatsby-plugin-canonical-urls`,
			options: {
				siteUrl,
			},
		},
		{
			resolve: `gatsby-plugin-robots-txt`,
			options: {
				host: siteUrl,
				sitemap: `${siteUrl}/sitemap.xml`,
				policy: [{ userAgent: `*`, allow: `/` }],
			},
		},
		{
			resolve: `gatsby-plugin-alias-imports`,
			options: {
				alias: {
					config: configPath,
					boilerplate: `${dirs.gatsbyTheme}/src`,
				},
			},
		},
		{
			resolve: `gatsby-plugin-create-client-paths`,
			options: {
				prefixes: [
					`/preview/*`,
				],
			},
		},
		{
			resolve: `gatsby-plugin-google-tagmanager`,
			options: {
				id: siteConfig.googleTagManagerId,
				includeInDevelopment: true,
			},
		},
		{
			resolve: `gatsby-plugin-emotion`,
			options: {
				hoist: true,
				sourceMap: true,
			},
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `escalade-website-boilerplate`,
				short_name: `boilerplate`,
				start_url: `/`,
				background_color: `#45A4EC`,
				theme_color: `#45A4EC`,
				display: `minimal-ui`,
				icon: icon || `${dirs.gatsbyTheme}/static/icon.png`,
			},
		},
		{
			resolve: `gatsby-source-sanity`,
			options: {
				projectId: siteConfig.sanityProjectId,
				dataset: siteConfig.sanityDataset,
				token: process.env.SANITY_TOKEN,
				watchMode: isDevMode,
			},
		},
	],
	developMiddleware,
})
