import React, { useMemo, useState } from 'react'
import { css } from '@emotion/core'
import { useStaticQuery, graphql } from 'gatsby'
import { getFixedGatsbyImage } from '@escaladesports/utils'
import { addToCart } from '@escaladesports/zygote-cart'
import { formatPrice, toCents } from '@escaladesports/utils'
import { useTemplateEngine } from '../context/template-engine'
import CallToAction from '../components/call-to-action'
import { inputField } from '../styles'
import {
	escaladeSite,
	sanityProjectId,
	sanityDataset
} from 'config'


const sanityConfig = {
	projectId: sanityProjectId,
	dataset: sanityDataset,
}


export default function AddToCartWidget(props) {
	const {
		sku,
		name,
		image,
		description,
		price,
		stock,
		allowQuantity
	} = props

	const [quantity, setQuantity] = useState(1)

	const { asset, templateVariable } = image

	// Try to replace template variable w/ value in case one is provided
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)
	const { asset: templateAsset } = templateValue || {}

	// Use asset ID/URL derived from template variable or the "hard-coded" one
	const imageId = templateValue?.asset?._id
		|| templateValue?.asset?._ref
		|| templateValue?.externalUrl
		|| asset?._id
		|| asset?._ref

	const fixedGatsbyImage = getFixedGatsbyImage(
		imageId,
		{ width: 100 },
		sanityConfig
	)
	const imageUrl = fixedGatsbyImage?.src

	const resolveValue = val => templateEngine.data
		? templateEngine.parse(val)
		: val


	const handleClick = () => addToCart({
		id: resolveValue(sku),
		name: resolveValue(name),
		image: imageUrl,
		description: resolveValue(description),
		price: toCents(resolveValue(price)),
		shippable: true,
		quantity: parseInt(quantity),
	})

	const stockValue = Number(resolveValue(stock)) || 0
	console.log("STOCK VALUE:", stockValue, typeof stockValue)
	if (!stockValue) return null

	return (
		<div css={style}>
			{allowQuantity && (
				<div css={inputField}>
					<label>Quantity</label>
					<input
						type="number"
						min="1"
						value={quantity}
						onChange={e => setQuantity(e?.target?.value)}
					/>
				</div>
			)}
			<CallToAction
				className="addButton"
				margin="0px"
				text="Add to Cart"
				onClick={handleClick}
			/>
		</div>
	)
}

const style = css`
	margin: 2rem 0;
	display: flex;
	align-items: flex-end;

	input {
		width: 4rem;
	}

	.addButton {
		margin-left: 1rem;
	}
`
