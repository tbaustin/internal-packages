module.exports = {
	plugins: [
		// Build plugins
		`gatsby-plugin-emotion`,

		// Client plugins
		`gatsby-plugin-react-helmet`,
		{
			resolve: `gatsby-plugin-html-attributes`,
			options: {
				lang: `en`,
			},
		},
	],
}
