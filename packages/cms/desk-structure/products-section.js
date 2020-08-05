import React, { useRef, useEffect } from 'react'
import _chunk from 'lodash/chunk'
import S from '@sanity/desk-tool/structure-builder'
import sanityClient from 'part:@sanity/base/client'
import getCachedAsyncData from '../cached-async-data'


/**
 * Hold cached async data here to use in multiple functions below without
 * verbosely calling the functions over and over
 */
let PRODUCT_NAME_KEY = ``
let API_PRODUCTS = []


/**
 * Checks to see if API products corresponding to the given chunk (page) of
 * baseProducts from CMS have already been loaded; if not, loads them & copies
 * results into the above variables
 */
const LOAD_PRODUCTS_CHUNK = async (chunk) => {
  const isLoaded = chunk.some(chunkProduct => {
    return API_PRODUCTS.find(apiProduct => {
      return apiProduct.sku === chunkProduct.sku
    })
  })

  console.log(`Chunk loaded?`, isLoaded)

  if (!isLoaded) {
    // API can only load products by variant IDs, so get them all
    const skus = chunk
      .map(c => c.variants.map(v => v.sku))
      .join()
      .split(`,`)

    const asyncData = await getCachedAsyncData(skus)

    // Copy into vars @ top of scope for reuse throughout file
    API_PRODUCTS = asyncData?.products
    PRODUCT_NAME_KEY = asyncData?.productNameKey
  }
}


/**
 * UNUSED FOR NOW
 * Proof of concept to lazy-load API data for each product as it's scrolled into
 * view; custom icon component triggers the lazy-loading.
 *
 * Can't use until Sanity provides a way to use a custom React component in
 * place of an individual listItem() in the Structure Builder. This would be
 * needed to make the list items refresh after lazy-loading completes.
 */
// const observer = new IntersectionObserver(async (entries) => {
//   const activeSkus = entries
//     .filter(e => e.isIntersecting)
//     .map(e => e.target.dataset.skus)
//     .join()
//     .split(",")
//     .filter(Boolean)
//
//   if (activeSkus.length) {
//     const cachedAsyncData = await getCachedAsyncData(activeSkus)
//     API_PRODUCTS = cachedAsyncData?.products
//     PRODUCT_NAME_KEY = cachedAsyncData?.productNameKey
//   }
// })
//
// const getLazyIcon = product => () => {
//   const skus = product?.variants?.map(v => v.sku)
//   const ref = useRef(null)
//
//   useEffect(() => {
//     !API_PRODUCTS.length && observer.observe(ref.current)
//   }, [skus])
//
//   return (
//     <span data-skus={skus} ref={ref}>
//       😊
//     </span>
//   )
// }




/**
 * Gets either:
 *    - All base product documents
 *    - All variant documents for a given base product (resolved from
 *      references) if the document for the base product is supplied
 */
const fetchCmsProducts = async (baseProduct) => {
  const variantIds = baseProduct?.variants?.map(v => v._ref || v._id)
  return variantIds?.length
    ? sanityClient.getDocuments(variantIds)
    : sanityClient.fetch(
      `*[_type == "baseProduct"] { ..., variants[]->{ _id, sku } }`
    )
}


/**
 * Pane showing base product's variants when user selects "Sellable Products"
 */
const variantsList = (cmsProduct, apiProduct) => async () => {
  const name = apiProduct?.[PRODUCT_NAME_KEY]
  const title = `Sellable Products: ${name || cmsProduct.sku}`

  // Get the full documents for the variants
  const cmsVariants = await fetchCmsProducts(cmsProduct)

  const items = cmsVariants?.map(variant => {
    const apiVariant = apiProduct?.variants?.find(v => v.sku === variant.sku)
    const variantName = apiVariant?.[PRODUCT_NAME_KEY] || variant.sku

    return S.documentListItem()
      .schemaType(`variant`)
      .title(variantName)
      .id(variant._id)
      .child(
        S.document()
          .title(`Edit Variant: ${variantName}`)
          .documentId(variant._id)
      )
  })

	return S.list().title(title).items(items)
}


/**
 * Editor pane for the base product when user selects "Edit Base Product"
 */
const baseProductEditor = async (cmsProduct, apiProduct) => {
  const name = apiProduct?.[PRODUCT_NAME_KEY]
  const title = `Edit Base Product: ${name || cmsProduct.sku}`

  return S.document()
    .title(title)
    .documentId(cmsProduct._id)
}


/**
 * Menu options shown after selecting a base product; allow the user to either
 * edit the base product or view its variants
 */
const productTasks = async (cmsProduct, apiProduct) => {
  const name = apiProduct?.[PRODUCT_NAME_KEY]

  return S.list()
    .id(cmsProduct?._id)
    .title(name || cmsProduct.sku)
    .items([
      S.listItem().title(`Edit Base Product`).child(
        baseProductEditor(cmsProduct, apiProduct)
      ),
      S.listItem().title(`Sellable Products`).child(
        variantsList(cmsProduct, apiProduct)
      )
    ])
}


const pageOfBaseProducts = (page, chunk) => async () => {
  await LOAD_PRODUCTS_CHUNK(chunk)

  return S.list()
    .id(`products-page-${page}`)
    .title(`Base Products (Page ${page})`)
    .items(
      chunk.map(cmsProduct => {
        const apiProduct = API_PRODUCTS?.find(p => {
          return p.sku === cmsProduct.sku
        })

        const name = apiProduct?.[PRODUCT_NAME_KEY]

        return S.documentListItem()
          .schemaType(`baseProduct`)
          // Unused for now (see commented section at top)
          // .icon(getLazyIcon(product))
          .title(name || cmsProduct.sku)
          .id(cmsProduct._id)
          .child(productTasks(cmsProduct, apiProduct))
      })
    )
}


/**
 * The overall "Products" menu item and first pane showing page selection for
 * base products
 */
export default S.listItem().title(`Products`).child(async () => {
  // Load base products from Sanity as our main "source of truth"
  const cmsProducts = await fetchCmsProducts()

  // Split products into chunks of 20 for pagination
  const chunks = _chunk(cmsProducts, 20)

  // Menu item to open list of pages
  return S.list()
    .title(`Base Products`)
    .items(
      chunks.map((chunk, idx) => {
        const page = idx + 1

        return S.listItem()
          .id(`products-${idx}`)
          .title(`Page ${page}`)
          .showIcon(false)
          .child(
            pageOfBaseProducts(page, chunk)
          )
      })
    )
})
