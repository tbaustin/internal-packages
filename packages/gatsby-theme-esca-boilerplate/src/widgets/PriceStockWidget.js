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
		<div css={style}>
			<div css={priceText}>
				{price || ``}
			</div>
			<div className="stockDisplay">
				{stock ? `In Stock` : `Out of Stock`}
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
