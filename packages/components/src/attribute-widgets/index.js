import React, { useState, useMemo } from 'react'
import isEqual from 'lodash/isEqual'
import buildWidgetStructure from './build-widget-structure'
import GenericWidget from './generic-widget'
import {
	config as testConfig,
	variants as testVariants,
} from './test-data'



const getNamesBySection = (section, attributes) => {
	const attrKeys = Object.keys(attributes)
	if (!section) return attrKeys

	return attrKeys.filter(key => {
		const attribute = attributes[key]
		return attribute.section === section
	})
}



export default function AttributeWidgets(props) {
	const {
		children,
		section,
		variants: variantsProp,
		config: configProp,
		identifier: identifierProp,
		initial,
		onChange,
		debug,
		test,
	} = props

	const config = test ? testConfig : configProp
	const variants = test ? testVariants : variantsProp
	const identifier = test ? `sku` : (identifierProp || `sku`)
	const initialId = test ? `1` : initial

	const [variantId, setVariantId] = useState(initialId)

	const handleSelect = newVariantId => {
		setVariantId(newVariantId)
		typeof onChange === `function` && onChange(newVariantId)
	}

	const currentVariant = useMemo(
		() => variants.find(v => v[identifier] === variantId),
		[variantId],
	)

	!!debug && console.log(
		`Current Variant:`,
		JSON.stringify(currentVariant, null, 2),
	)

	const widgetStructure = useMemo(
		() => buildWidgetStructure(currentVariant, variants, config),
		[currentVariant, variants],
	)

	const attributeNames = useMemo(
		() => getNamesBySection(section, widgetStructure),
		[section, widgetStructure],
	)

	// Don't render any widgets if current variant has no attributes
	const shouldHide = useMemo(
		() => attributeNames.every(name => !currentVariant[name]),
		[attributeNames],
	)

	const widgets = (
		<>
			{attributeNames.map((name, i) => {
				const attribute = widgetStructure[name] || {}
				const { options = [], component, label } = attribute

				if (!options.length) return null

				const selectedOption = options.find(op => {
					return isEqual(currentVariant[name], op.value)
				})

				const { sku } = selectedOption || {}
				const Widget = component || GenericWidget

				return (
					<Widget
						key={`widget-${i}`}
						label={label}
						options={options}
						value={sku}
						onChange={handleSelect}
					/>
				)
			})}
		</>
	)

	const elements = typeof children === `function`
		? children(widgets)
		: widgets

	return shouldHide ? null : elements
}
