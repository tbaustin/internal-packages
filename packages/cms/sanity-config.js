
module.exports = {
	plugins: [
		`@sanity/dashboard`,
		`@sanity/base`,
		`@sanity/components`,
		`@sanity/default-layout`,
		`@sanity/default-login`,
		`@sanity/desk-tool`,
		`@sanity/color-input`,
		`@sanity/production-preview`,
		`dashboard-widget-netlify`,
	],
	env: {
		development: {
			plugins: [
				`@sanity/vision`,
			],
		},
	},
	parts: [
		{
			implements: `part:@sanity/dashboard/config`,
			path: `./dashboardConfig.js`,
		},
		{
			name: `part:@sanity/base/schema`,
			path: `./schemas/schema.js`,
		},
		{
			name: `part:@sanity/base/initial-value-templates`,
			path: `./initial-value-templates`,
		},
		{
			name: `part:@sanity/desk-tool/structure`,
			path: `./desk-structure`,
		},
		{
			implements: `part:@sanity/base/document-actions/resolver`,
			path: `./document-actions`,
		},
		{
			implements: `part:@sanity/production-preview/resolve-production-url`,
			path: `./parts/resolve-preview-url.js`,
		},
	],
}
