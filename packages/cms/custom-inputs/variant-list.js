import React, { useState, useEffect, forwardRef } from 'react'
import { getApiProduct, getProductNameKey } from '../cached-async-data'
import SortableList from './sortable-list'
import useDocuments from './sortable-list/use-documents'


/**
 * Special list input for reordering a base product's variants
 * Easiest to tie together all necessary data here in a custom input
 */
export default forwardRef((props, ref) => {
  const [apiProducts, setApiProducts] = useState([])
  const [nameKey, setNameKey] = useState(``)
  const documents = useDocuments(props.value)

  useEffect(() => {
    const getApiData = async () => {
      const promises = documents.map(getApiProduct)
      const results = await Promise.all(promises)
      setApiProducts(results)

      const nameKeyResult = await getProductNameKey()
      setNameKey(nameKeyResult)
    }
    getApiData()
  }, [documents])

  const renderItem = (item) => {
    const productData = apiProducts?.find?.(p => p?.sku === item?.sku)
    const name = productData?.[nameKey]
    return name ? `${item?.sku}: ${name}` : item?.sku
  }

  return (
    <SortableList
      documents={documents}
      ref={ref}
      renderItem={renderItem}
      {...props}
    />
  )
})
