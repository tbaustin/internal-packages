import client from 'part:@sanity/base/client'
import swatch from './swatch'
import category from './category'
import { baseProduct, variant } from './product-types'
import * as pageTypes from './page-types'
import * as widgetTypes from './widget-types'
import * as heroImageTypes from './hero-image-types'
import * as otherFieldTypes from './other-field-types'
import * as customFieldTypes from './custom-field-types'
import * as siteSettingsTypes from './site-settings-types'

/**
 * Here's where all schema types in the CMS are joined together
 * EXCEPT FOR THE ONE BELOW - we don't want any Inception here...
 */
export const schemaTypes = [
	swatch,
	category,
	baseProduct,
	variant,
	...Object.values(pageTypes),
	...Object.values(widgetTypes),
	...Object.values(heroImageTypes),
	...Object.values(otherFieldTypes),
	...Object.values(customFieldTypes),
	...Object.values(siteSettingsTypes)
]

/**
 * A schema type to hold the entire schema as JSON
 * Woah...
 */
export default {
	name: `persistedSchema`,
	title: `Persisted Schema`,
	type: `document`,
	fields: [
		{
			name: `json`,
			title: `JSON Data`,
			type: `text`,
		},
	],
}

/**
 * A little hack...Either clever or dumb (you decide), but I couldn't find any
 * better way...
 *
 * Runs one time wherever this JS file is located in the production bundle so
 * that the entire schema automatically gets saved to the 'persistedSchema'
 * document type as JSON.
 *
 * This is needed so that our Sanity schema itself can be easily used in the
 * Gatsby site. Directly importing these schema files in the Gatsby part of the
 * repo leads to various problems due to the different environment/context.
 *
 * Yes, this runs on every Sanity Studio page load... ¯\_(ツ)_/¯
 *
 */
!async function() {

	// Alias functions as a placeholder string in the JSON
	const output = JSON.stringify(schemaTypes, (key, val) => {
		return typeof val === `function` ? `function()` : val
	})

	// Always save as the same singleton document
	const document = {
		_id: `sanity-schema`,
		_type: `persistedSchema`,
		json: output,
	}

	try {
		const result = await client.createOrReplace(document)
		console.log(`JSON schema saved`, result)
	}
	catch(e) {
		let shouldLogError = !e.message.endsWith(`permission "create" required`)
		shouldLogError && console.error(e)
		console.log(`
      JSON schema not saved.
      Disregard this message if deploying GraphQL API.
      Otherwise, check for errors above.
    `)
	}

}()
