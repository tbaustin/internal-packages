import React from 'react'
import { css } from '@emotion/core'
import { formatPrice } from '@escaladesports/utils'
import { useTemplateEngine } from '../context/template-engine'
import { priceText, variables } from '../styles'


export default function PriceStockWidget(props) {
	const { price: priceProp, stock: stockProp } = props

	const templateEngine = useTemplateEngine()

	const price = formatPrice(
		templateEngine.data
			? templateEngine.parse(priceProp?.toString?.() || ``)
			: priceProp
	)

	const stock = Number(
		templateEngine.data
			? templateEngine.parse(stockProp?.toString?.() || ``)
			: stockProp
  )

	return (
		<div css={style} itemProp="offers" itemScope itemType="https://schema.org/Offer">
      <meta itemProp="priceCurrency" content={`USD`} />
      <meta itemProp="price" content={price.substring(1) || ``} />
			<div css={priceText}>
				{price || ``}
			</div>
			<div className="stockDisplay">
        <meta itemProp="availability" content={stock ? "InStock" : "OutOfStock"} />
        <span>{stock ? `In Stock` : `Out of Stock`}</span>
			</div>
		</div>
	)
}

const style = css`
  width: 100%;

	.stockDisplay {
		font-size: 0.8rem;
		font-weight: bold;
		color: ${variables.colors.textMedium};
	}
`
