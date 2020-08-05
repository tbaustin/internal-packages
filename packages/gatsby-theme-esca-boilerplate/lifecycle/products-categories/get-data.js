const EscaAPIClient = require(`@escaladesports/esca-api-client`).default
const sanityClient = require(`@sanity/client`)
const prepareProducts = require(`./prepare-products`)
const buildCategoryAncestry = require(`./category-ancestry`)

const dirs = require(`@escaladesports/boilerplate/dirs`)
const siteConfig = require(`${dirs.site}/config`)


const isDevMode = process.env.NODE_ENV === `development`
const apiStage = siteConfig.apiStages.products || `prod`


const client = sanityClient({
	projectId: siteConfig.sanityProjectId,
	dataset: siteConfig.sanityDataset,
	token: process.env.SANITY_TOKEN,
	useCdn: !isDevMode,
})

const escaClient = new EscaAPIClient({
	site: siteConfig.escaladeSite,
	environment: apiStage,
	apiKey: apiStage === `prod`
		? process.env.X_API_KEY
		: process.env[`X_API_KEY_${apiStage.toUpperCase()}`],
})


module.exports = async function getData() {
	const categories = await client.fetch(`*[_type == "category"]`)
	const customFields = await client.fetch(`*[_type == "customField"]`)
	const cmsProducts = await client.fetch(`
		*[_type == "baseProduct"] {
			...,
			template->{
				_id, title, path
			},
			"cmsVariants": variants[]->{
				_type, _id, sku, customFieldEntries
			},
			"relatedProducts": relatedProducts[]->{
				_id, sku
			}
		}
	`)

	const salsifyProperties = customFields
		.map(field => field.salsifyName)
		.filter(Boolean)

	const apiProducts = await escaClient.loadProducts({
		skus: [`all`],
		fields: [`inventory`, `price`],
		salsify: salsifyProperties,
		byParent: true,
	})

	const categoriesWithAncestry = buildCategoryAncestry(categories)

	const fullProducts = !cmsProducts.length ? [] : await prepareProducts({
		cmsProducts,
		apiProducts,
		salsifyProperties,
		categories: categoriesWithAncestry,
	})

	return {
		categories: categoriesWithAncestry,
		products: fullProducts,
	}
}