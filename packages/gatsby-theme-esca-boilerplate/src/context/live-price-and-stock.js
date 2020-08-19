import { useState, useEffect } from 'react'
import EscaAPIClient from '@escaladesports/esca-api-client'
import siteConfig from 'config'


const apiClient = new EscaAPIClient({
	site: siteConfig.escaladeSite,
})


export default function useLivePriceAndStock(products){
	const [apiData, setApiData] = useState({})

	const skus = products.reduce((acc, cur) => {
		const { variants } = cur
		const variantSkus = variants?.map?.(v => v?.sku)
		if(variantSkus){
			acc.push(...variantSkus)
		}
		return acc
	}, [])
  
	useEffect(() => {
		const loadApiData = async () => {
			const result = await apiClient.loadProducts({
				fields: [`inventory`, `price`],
				returnAsObject: true,
				skus,
			})
			if (result) setApiData(result)
		}

		if (skus.length) loadApiData()
	}, [])

	return products.map(product => {
		const { variants } = product || {}
    
		const variantsWithLiveData = variants?.map?.(variant => {
			const apiProduct = apiData[variant?.sku]

			const apiStockSet = ![null, undefined, ``].includes(apiProduct?.stock)
			const stock = apiStockSet ? apiProduct.stock : variant?.stock
			const price = apiProduct?.price || variant?.price
			const rating = Math.floor(Math.random() * 5) + 1 
			return { ...variant, price, stock, rating }
		})

		return { ...product, variants: variantsWithLiveData || variants }
	})
}