import client from 'part:@sanity/base/client'
import HTMLInput from '../custom-inputs/html-input'

// import slugify from 'slugify'



/**
 * Builds out an array of slugs for all ancestor categories based on the nearest
 * parent category ID; keeps going "up the tree" until there is no parent
 */
const addAncestors = async (parentId) => {
	let ancestors = []

	const addParent = async (id) => {
		const parentCategory = await client.getDocument(id)
		let { _ref: grandparentId } = parentCategory.parent || {}
		let { current: fullSlug } = parentCategory.slug || {}

		/**
     * Use the parent's unique portion of its slug only
     * (avoids duplication of ancestry)
     */
		const baseSlug = fullSlug.split(`/`).pop()

		// Prepend array with the parent's slug
		if (baseSlug) ancestors.unshift(baseSlug)

		// Recursively add next level (grandparent) if applicable
		if (grandparentId) return addParent(grandparentId)
	}

	if (parentId) await addParent(parentId)
	return ancestors
}



const slugify = str => (str || ``)
	.toLowerCase()
	.trim()
	.replace(/\s+/g, `-`)
	.replace(/[^a-z0-9\-_&]+/g, ``)
	.replace(`&`, `and`)



export default {
	name: `category`,
	title: `Category`,
	type: `document`,
	fields: [
		{
			name: `name`,
			title: `Category Name`,
			type: `string`,
			validation: Rule => Rule.required(),
		},
		{
			name: `slug`,
			title: `Slug`,
			type: `slug`,
			options: {
				/**
         * Create slug based on the current category's name
         * If "Use ancestor categories in slug" is checked, also use slugs from
         * the parent, grandparent, and up.
         */
				source: async (doc) => {
					if (!doc.name) return ``
					if (!doc.useAncestorsInSlug) return [ doc.name ]
					const { _ref: parentId } = doc.parent || {}
					const ancestors = await addAncestors(parentId)
					return [ ...ancestors, doc.name ]
				},
				// Final slug joins ancestry into a path with slashes
				slugify: input => input.map(slugify).join(`/`),
			},
			validation: Rule => Rule.required(),
		},
		{
			name: `useAncestorsInSlug`,
			title: `Use ancestor categories in slug`,
			type: `boolean`,
		},
		{
			name: `description`,
			title: `Category Description`,
			type: `text`,
		},
		{
			name: `banner`,
			title: `Banner Image`,
			description: `Note: this field will be removed in the future; using `
				+ `'Images' below is suggested`,
			type: `image`,
		},
		{
			name: `images`,
			title: `Images`,
			type: `array`,
			of: [{ type: `image` }]
		},
		{
			name: `video`,
			title: `Category Video`,
			type: `upload`,
		},
		{
			name: `parent`,
			title: `Parent Category`,
			type: `reference`,
			to: [{ type: `category` }],
		},
		{
			name: `template`,
			title: `Template`,
			type: `reference`,
			to: [{ type: `template` }],
		},
	],
	initialValue: {
		useAncestorsInSlug: true,
	},
	preview: {
		select: {
			title: `name`,
			subtitle: `slug.current`,
		},
	},
}
