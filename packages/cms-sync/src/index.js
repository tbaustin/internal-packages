import { nanoid } from 'nanoid'

import { productRequest, sanityRequest } from './request'
import { sanityId, slugify, getSkus, createImageMutations, imageFields } from './utils'

export default async function cmsSync(args) {
	const { 
		sanityConfig, 
		apiKey, 
		sanityKey,
		...restProps
	} = args
	console.log(`Product Sync Started`)

	const customFieldRes = await sanityRequest({
		...sanityConfig,
		apiKey: sanityKey,
		type: `query`,
		endpoint: `data`,
		body: { 
			query: /* groq */`*[ _type == "customField" && (fieldType == "images" || useAsName == true) ]`,  
		},
	})

	// use as name field for product slugs
	const useAsNameField = customFieldRes?.result
  ?.find?.(({ useAsName }) => !!useAsName)
  ?.salsifyName

	// all image types from salsify
	const imageTypes = customFieldRes?.result
  ?.filter?.(({ salsifyName, useAsName }) => !!salsifyName && !useAsName)

	const salsify = [
		...(restProps?.salsify || []),
		...(imageTypes?.map?.(({ salsifyName }) => salsifyName) || []),
		...(useAsNameField ? [useAsNameField] : []), 
	]

	// fetch products from api
	const baseProducts = await productRequest({
		...restProps,
		salsify,
		apiKey,
	})

	if(!baseProducts){
		throw new Error(`No Products Found From Api`)
	}

	const allSkus = getSkus(baseProducts)

	console.log(`Fetched ${allSkus.length} total products (base & variant)`)

	// find existing cms products
	const checkedProductsRes = await sanityRequest({
		...sanityConfig,
		apiKey: sanityKey,
		type: `query`,
		endpoint: `data`,
		body: { 
			query: /* groq */	`*[ sku in $skus ]{..., variants[]->}`,
			params: { skus: allSkus || []},
		},
	})

	// create a hash map with variants/baseproducts all at top level
	const checkedProducts = checkedProductsRes?.result?.reduce((acc, cur) => {
		return { ...acc, [cur.sku]: cur }
	}, {})

	// create mutations to send to sanity
	const mutations = []
	// only get products that exist

	// lets us log out percentage complete
	const totalPercent = Object.keys(baseProducts).length
	let count = 1

	// loop through each product and create variant/baseProducts in sanity

	console.log(`Building mutations...`)
	for (let productId in baseProducts) {
		const baseProduct = baseProducts[productId] || {}
		const existingBaseProduct = checkedProducts?.[productId]
		const cmsVariants = existingBaseProduct ? existingBaseProduct.variants : []
		const { variants } = baseProduct
		const name = baseProduct?.[useAsNameField]
		/*
    *
    *  			START OF VARIANT SECTION
    *
  */

		/*
    * This is for UPDATING and DELETING variants
    * It will also keep existing order and values 
  */

		cmsVariants.forEach(cmsVar => {
			const { _id, sku } = cmsVar
			console.log(`Using existing variant: ${_id}...`)
			let mutation = {}
			const apiVariant = variants?.[_id]
			let patches = {}

			if(apiVariant){
				// HANDLE EXISTING IMAGES HERE FOR VARIANTS!!
				imageTypes.forEach(imgType => {
					const { salsifyName, name } = imgType
					const apiImages = apiVariant?.[salsifyName] || [] // images from the api
					const cmsImages = cmsVar?.customFieldEntries // images from existing cms
          ?.find?.(({ fieldName }) => fieldName === name)
          ?.fieldValue?.images || []
					// only need to get images that will be deleted (unsetting)
					// and also images that are new or be adding to the end of the array

					patches = { 
						...patches, 
						...createImageMutations({ apiImages, cmsImages, name, sku }),
					}
				})
				// the variant needs to be updated on the product in the cms

				// use the custom field to get variant name
				const variantName = apiVariant?.[useAsNameField]
				const slugValue = name === variantName ? slugify(`${name}-${_id}`) : slugify(variantName)

				if(slugValue && (cmsVar?.slug?.current !== slugValue)) {
					// if the parent and variant have the same name then append the variant sku to the 
					// parent name
					patches.set = { 
						...(patches?.set || {}),
						slug: {current: slugValue },
					}
				}

				if(Object.keys(patches).length){
					mutation.patch = {
						id: _id,
						...patches,
					}
				}

			} else {
				// the variant needs to be removed from product in the cms
				console.log(`Removing variant: ${_id} from product: ${productId}`)
				mutation.patch = {
					id: sanityId(productId),
					unset: [/* groq */`variants[ _ref == "${_id}"]`], 
				}
			}

			if(Object.keys(mutation).length){
				mutations.push(mutation)
			}
		})

		/*
    * This will look to see if there are NEW
    * variants to be ADDED onto the product
  */

		const newVariants = Object.keys(variants).filter(sku => !cmsVariants.find(({ _id }) => sku === _id))

		newVariants.forEach(sku => {
			const variant = variants[sku]
			const variantName = variant?.[useAsNameField]
    
			const variantMutation = {
				_id: sanityId(sku),
				_type: `variant`,
				sku: sku,
				customFieldEntries: [],
			}

			// HANDLE NEW IMAGES HERE FOR VARIANTS!!
			imageTypes.forEach(imgType => {
				const { salsifyName, name } = imgType
				const variantImages = variant?.[salsifyName]

				if(variantImages && Array.isArray(variantImages)) {
					variantMutation.customFieldEntries.push({
						fieldName: name,
						fieldValue: {
							images: variantImages.map(url => imageFields({ url, sku })),
						},
					})
				}
			})

    

			if(variantName) {
				const slugValue = name === variantName ? slugify(`${name}-${sku}`) : slugify(variantName)
				variantMutation.slug = { current: slugValue }
			}

			mutations.push({
				createOrReplace: {
					...variantMutation,
				},
			})
		})
  
		/*
    *
    *  			END OF VARIANT SECTION
    *
  */

		/*
    * If new variants exists, attach them to the product
  */
  

		if(existingBaseProduct){
			console.log(`Using existing base product ${productId}...`)
			let mutation = {}

			if(name && (slugify(name) !== existingBaseProduct?.slug?.current)){
				mutation.set = { slug: {current: slugify(name)} }
			}
    
			// images from salsify here
			imageTypes.forEach(imgType => {
				const { salsifyName, name } = imgType
				const apiImages = baseProduct?.[salsifyName] || [] // images from the api
				const cmsImages = existingBaseProduct?.customFieldEntries // images from existing cms
        ?.find?.(({ fieldName }) => fieldName === name)
        ?.fieldValue?.images || []

				// only need to get images that will be deleted (unsetting)
				// and also images that are new or be adding to the end of the array

				mutation = { 
					...mutation, 
					...createImageMutations({ apiImages, cmsImages, name, sku: existingBaseProduct.sku }),
				}
      
			})


			// add the new variants to the baseProducts
			if(newVariants.length){
				mutations.push({
					patch: {
						id: sanityId(productId),
						insert: {
							after: `variants[-1]`,
							items: newVariants.map(sku => ({
								_key: nanoid(),
								_type: `reference`,
								_ref: sanityId(sku), 
							})),
						},
					},
				})
			}

			if(Object.keys(mutation).length){
				mutations.push({
					patch: {
						id: sanityId(productId),
						...mutation,
					},
				})
			}
    
		} else {
			const baseMutation = {
				_id: sanityId(productId),
				_type: `baseProduct`,
				sku: productId,
				variants:  newVariants?.map?.(sku => ({
					_key: nanoid(),
					_type: `reference`,
					_ref: sanityId(sku), 
				})) || [],
				customFieldEntries: [],
			}

			// new images from salsify here
			imageTypes.forEach(imgType => {
				const { salsifyName, name } = imgType
				const images = baseProduct?.[salsifyName]

				if(images && Array.isArray(images)) {
					baseMutation.customFieldEntries.push({
						fieldName: name,
						fieldValue: {
							images: images.map(url => imageFields({ url, sku: productId }) ),
						},
					})
				}
			})

			if(name) {
				baseMutation.slug = { current: slugify(name) }
			}
			mutations.push({
				createOrReplace: {
					...baseMutation,
				},
			})
		}

		console.log(`${totalPercent ? ((count / totalPercent) * 100).toFixed(2) : `100`}% of mutations created`)
		count++

	}

	try {
		console.log(`Uploading Products to Sanity...`)
		const sanityRes = await sanityRequest({
			...sanityConfig,
			apiKey: sanityKey,
			type: `mutate`,
			endpoint: `data`,
			body: { mutations },
		})
		if (sanityRes.results) {
			console.log(`${sanityRes.results.length} products synced/updated to sanity`)
			// if results are successful it is safe to assume references have been removed
			if(restProps?.skus?.[0] === `all` || !restProps?.skus) {
				const deleteRes = await sanityRequest({
					...sanityConfig,
					apiKey: sanityKey,
					type: `mutate`,
					endpoint: `data`,
					body: { 
						mutations: [
							{
								delete: {
									query: /* groq */`*[ (_type == "baseProduct" || _type == "variant") && !(sku in $skus) ]`,
									params: { skus: allSkus },
								},
							},
						], 
					},
				})
				console.log(`DELETED ${deleteRes?.results?.length} products`)
			} else {
				console.log(`Must pass one string of "all" in skus for products to be deleted or no skus at all`)
			}
      
			return ({ success: true })
		} else {
			console.log(`No Products Synced`, sanityRes)
			return ({ success: false, response: sanityRes })
		}
	} catch (e) {
		const { response } = e
		if (response) {
			const { data } = response
			console.log(`Error With Uploading Products:`, data, response)
			return ({ success: false, response: data })
		} else {
			console.log(`Error With Uploading Products:`, e)
			return ({ success: false, response: e })
		}
	}
}