import sanityClient from 'part:@sanity/base/client'
import ImageListInput from '../../custom-inputs/image-list'
import CustomFieldsInput from '../../custom-inputs/custom-fields'
import ProductInfoDisplay from '../../custom-inputs/product-info-display'
import { getApiProduct, getProductNameKey } from '../../cached-async-data'


const isUnique = async (slug, options) => {
	const id = options.document._id.replace(`drafts.`, ``)
	const query = `count(*[slug.current == $slug && _id != $id && !(_id in path('drafts.**'))]{_id})`
	const params = { slug, id }
	const count = await sanityClient.fetch(query, params)
	return !count
}


function checkDups(arr){
	const items = arr.filter((item, index) => arr.findIndex(({_ref}) => _ref === item._ref) !== index)
	if(items.length) return true
	return false
}


const slugify = str => (str || ``)
	.toLowerCase()
	.trim()
	.replace(/\s+/g, `-`)
	.replace(/[^a-z0-9\-_&]+/g, ``)
	.replace(`&`, `and`)


export default [
	{
		name: `sku`,
		title: `Sku`,
		type: `string`,
		inputComponent: ProductInfoDisplay
	},
	{
		name: `slug`,
		title: `Slug`,
		type: `slug`,
		options: {
			// Use Salsify property-based product name as source for slug
			source: async (doc) => {
				const product = await getApiProduct(doc)
				const nameKey = await getProductNameKey()

				const name = doc._type === `baseProduct`
					? product?.salsify?.[nameKey]
					: product?.[nameKey]

				return name || doc.sku
			},
			slugify,
			isUnique,
		},
	},
	{
		name: `customFieldEntries`,
		title: `Custom Field Entries`,
		type: `array`,
		of: [{ type: `customFieldEntry` }],
		options: {
			site: `lifeline`,
		},
		inputComponent: CustomFieldsInput,
	},
]
