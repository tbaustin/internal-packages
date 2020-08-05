import sanityClient from 'part:@sanity/base/client'
import EscaAPIClient from '@escaladesports/esca-api-client'
import { useState, useEffect } from 'react'


/**
 * This file provides utilities for accessing any data that has to be initially
 * fetched asynchronously but doesn't need to be refreshed frequently
 *
 * The data fetched here will only be fetched one time in the JS bundle (i.e.
 * only when the Sanity Studio has been initially loaded or hard-refreshed).
 *
 * This minimizes the number of requests and also allows the data to be imported
 * & accessed the same way in ANY file (schema/desk structure/etc.).
 *
 * The data includes:
 *        products:   All Escalade API product data that is needed throughout
 *                    the entire CMS
 *
 *  productNameKey:   The Salsify property name chosen as product name
 *
 */


const isDev = process.env.NODE_ENV === `development`

const escaClient = new EscaAPIClient({
  environment: `prod`,
  site: `lifeline`,
  ...isDev && {
    devHost: `http://localhost:8000`
  }
})


/**
 * Holds the existing pending or resolved promise for fetching all async data
 * All functions below ultimately return/use this (or a part of the result)
 */
let dataPromise = null


/**
 * Function to do the actual asynchronous fetches
 *  - Gets the custom field-based product name key from Sanity client
 *  - Gets all of the site's products from Esca API (grouped by Salsify parent)
 *    - Optionally gets specific SKUs
 */
async function loadAsyncData(skus)  {
  // Get the property name to use as product name
  const customFields = await sanityClient.fetch(`*[_type == "customField"]`)
  const nameField = customFields.find(f => !!f.useAsName)
  const productNameKey = nameField?.salsifyName

  // All Salsify property names to be used in Esca API request
  const salsify = customFields.map(f => f.salsifyName).filter(Boolean)

  // Get Esca API products grouped by parent
  const products = await escaClient.loadProducts({
    ...skus?.length && { skus },
    ...salsify.length && { salsify },
    fields: [`inventory`, `price`],
    byParent: true
  })

  return { products, productNameKey }
}


const getUnloadedSkus = (skus, products) => {
  return skus.filter(sku => {
    return products.find(p => p.variants.find(v => v.sku === sku))
  })
}


/**
 * Function to get memoized/cached values for all async data originally fetched
 * with loadAsyncData()
 *
 * Starts the request if not already started; otherwise, returns the existing
 * promise
 */
export default async function getCachedAsyncData(skus) {
  if (!dataPromise) {
    dataPromise = loadAsyncData(skus)
  }
  /**
   * If additional SKUs have been requested, wait for existing API request to
   * finish, fetch the additional SKUs, and add them to existing
   */
  if (skus) {
    let { products, productNameKey } = await dataPromise
    let unloadedSkus = getUnloadedSkus(skus, products)
    let { products: newProducts } = await loadAsyncData(unloadedSkus)
    dataPromise = {
      products: [ ...products, ...newProducts ],
      productNameKey
    }
  }
  return dataPromise
}


/**
 * Functions to get specific parts of the memoized/cached data
 */
export async function getProductNameKey() {
  const result = await getCachedAsyncData()
  return result?.productNameKey
}

export async function getAllApiProducts() {
  const result = await getCachedAsyncData()
  return result?.products
}

/**
 * Gets a single product or variant from memoized/cached Esca API products
 * Requires a Sanity document object for either a baseProduct or variant
 */
export async function getApiProduct(cmsProduct) {
  const findSku = list => list.find(val => val.sku === cmsProduct.sku)
  const apiProducts = await getAllApiProducts()

  // For a base product, find the matching base product from API
  if (cmsProduct._type === `baseProduct`) {
    let apiBaseProduct = findSku(apiProducts)
    return apiBaseProduct
  }
  /**
   * For a variant, find a base product containing a matching variant in its
   * variants array, return the matching variant found
   */
  let foundVariant = null
  apiProducts.find(p => {
    return foundVariant = findSku(p?.variants)
  })
  return foundVariant
}


/**
 * Custom hook to use one of the memoized/cached Esca API products within a
 * React component
 */
export function useApiProduct(cmsProduct) {
  const [apiProduct, setApiProduct] = useState()

  useEffect(() => {
    const loadApiProduct = async () => {
      const result = await getApiProduct(cmsProduct)
      setApiProduct(result)
    }
    loadApiProduct()
  }, [cmsProduct])

  return apiProduct
}


/**
 * Custom hook to use the custom field-based product name key within a React
 * component
 */
export function useProductNameKey() {
  const [productNameKey, setProductNameKey] = useState(``)

  useEffect(() => {
    const loadProductNameKey = async () => {
      const result = await getProductNameKey()
      setProductNameKey(result)
    }
    loadProductNameKey()
  }, [])

  return productNameKey
}
