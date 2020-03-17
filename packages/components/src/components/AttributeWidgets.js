import React, { useState, useMemo } from 'react'
import isEqual from 'lodash/isEqual'

import buildAttributes from '../utils/build-attributes'
import GenericWidget from './GenericWidget'

const getNamesBySection = (section, attributes) => {
	const attrKeys = Object.keys(attributes)
	if (!section) return attrKeys

	return attrKeys.filter(key => {
		const attribute = attributes[key]
		return attribute.section === section
	})
}

export default function AttributeWidgets(props) {
	const { children, section, variants, attributes, initialSku, debug } = props
  
	const [variantSku, setVariantSku] = useState(initialSku)
	const variant = useMemo(() => variants.find(v => v.sku === variantSku), [variantSku])
    
	if(debug) console.log(`Current Variant: `, JSON.stringify(variant, null, 2))

	const builtAttributes = useMemo(() => buildAttributes(variant, variants, attributes), [variant, variants])
	const attributeNames = useMemo(() => getNamesBySection(section, builtAttributes), [section, builtAttributes])
	const shouldHide = useMemo(() => attributeNames.every(name => !variant[name]), [attributeNames])
  
	const widgets = (
		<> 
			{attributeNames.map((name, i) => {
				const attribute = builtAttributes[name] || {}
				const { options = [], component, label } = attribute

				if (!options.length) return null

				const selectedOption = options.find(op => {
					return isEqual(variant[name], op.value)
				})
        
				const { sku } = selectedOption || {}
				const Widget = component || GenericWidget
        
				return (
					<Widget 
						key={`widget-${i}`}
						label={label}
						options={options}
						value={sku}
						onChange={setVariantSku}
					/>
				)
			})}
		</>
	)
	const elements = typeof children === `function` ? children(widgets) : widgets
	return shouldHide ? null : elements
}