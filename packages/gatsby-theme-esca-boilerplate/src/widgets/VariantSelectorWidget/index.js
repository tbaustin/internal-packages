import React from 'react'
// import loadable from '@loadable/component'
import { AttributeWidgets as WidgetsRenderer } from '@escaladesports/components'
import * as attributeWidgets from './AttributeWidgets'
import { sanityProjectId, sanityDataset } from 'config'
import { useTemplateEngine } from '../../context/template-engine'
import { useCurrentVariant } from '../../context/current-variant'
import SelectBySkuInput from './SelectBySkuInput'


// const AsyncWidget = loadable(props => import(`./${props.type}`))


export default function VariantSelectorWidget({ method, trimLabels }) {
	const [currentSku, setCurrentSku] = useCurrentVariant()
	const templateEngine = useTemplateEngine()

	if (!currentSku) return null

	const variants = templateEngine?.data?.variants?.map(v => ({
		sku: v?.sku,
		name: v?.name,
		...v?.customFields
	}))

	if (method === `by-sku`) return (
		<SelectBySkuInput
			variants={variants}
			value={currentSku}
			onChange={setCurrentSku}
			trimLabels={trimLabels}
		/>
	)

	const customFields = templateEngine?.schema
		?.find(type => type.name === `variant`)?.fields
		?.find(field => field?.name === `customFields`)
		?.fields || []

	const attributes = customFields.filter(field => field?.attributeWidget)
	if (!attributes?.length) return null

	const attributeConfig = attributes.reduce((config, field) => ({
		...config,
		...field?.name && {
			[field.name]: {
				label: field.title,
				component: attributeWidgets[field.attributeWidget]
				// component: props => (
				// 	<AsyncWidget
				// 		{...props}
				// 		type={field.attributeWidget}
				// 	/>
				// )
			}
		}
	}), {})

	return (
		<WidgetsRenderer
			config={attributeConfig}
			variants={variants}
			initial={currentSku}
			onChange={setCurrentSku}
		/>
	)
}
