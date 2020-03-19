import _get from 'lodash/get'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'


/**
 * Converts a graph structure to an Array containing the graph's original nodes
 */
export function graphToArray(graph, path) {
	const { edges = [] } = graph || {}

	return edges.map(edge => {
		const { node } = edge || {}
		return path ? _get(node, path) : node
	})
}


/**
 * Gets the display name of a React component
 */
export function getComponentName(component) {
	const { displayName, name } = component || {}
	return displayName || name || `Component`
}

/**
 * Return formatted price: 2, `2.3` => `$2.00`, `$2.30`
 */

export function formatPrice(price) {
	if(isNaN(+price)) return null

	return (+price).toLocaleString(`en-US`, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

/**
 * Converts dollars to cents: $3.00 => 300 cents
 */

export function toCents(dollars) {
	const centsString = formatPrice(dollars).replace(/[^\d.]/g, ``)
	return +centsString
}

/**
 * Converts cents to dollars: 300 cents => $3.00
 */

export function toDollars(cents) {
	return formatPrice((cents / 100))
}

/**
 * Builds out the attributes from the CMS into usable code for the widgets
 */

export function buildAttributes(currentVariant, variants, initAttributes) {  
	const attributeSettings = cloneDeep(initAttributes)
	const attributes = Object.keys(attributeSettings)
	
	/**
   * Find a variant that has:
   *  - The given value (option) for the given attribute
   *  - The current variant's values for all other attributes
   */
	const getVariantForOption = (attribute, option) => {
		// example: attribue = size , option = small
		const otherAttributes = attributes.filter(a => a !== attribute) // example: [color, unit]

		// Products that have the passed option for the passed attribute
		const variantsWithOption = variants.filter(v => isEqual(v[attribute], option))

		// If there's only 1 variant with the passed option, just use that variant
		// (or else customer would have no way to navigate to it)
		if (variantsWithOption.length === 1) return variantsWithOption[0]

		// Otherwise, find a variant that matches the current variant for all other attributes
		return variantsWithOption.find(variant => {
			return otherAttributes.every(attr => {
				// OR either the product or current product doesn't have the attribute at all
				let attrNonApplicable = !variant[attr] || !currentVariant[attr]
				return isEqual(variant[attr], currentVariant[attr]) || attrNonApplicable
			})
		})
	}

	/**
   * Push all the options into the attributes
   * Each option has a value and the ID of the variant it would lead to if selected
   *
   * Variant ID will be undefined if no variant exists with that combination
   * This can be used to either hide the option or disable it
   */
	for (let variant of variants) {
		for (let attribute in variant) {
			// Skip frontmatter properties that aren't actually attributes
			if (!(attribute in attributeSettings)) continue

			let value = variant[attribute]
			let { options } = attributeSettings[attribute] || {}

			// Skip if the option has already been pushed
			let exists = !!options.find(op => isEqual(op.value, value))
			if (exists) continue

			let { sku } = getVariantForOption(attribute, value) || {}
			options.push({ value, sku })
		}
	}

	return attributeSettings
}

/**
 * Trims strings with reference of a common string
 */

export const trimVariantNames = (variants = []) => {
	const hasStringInCommon = string => {
		return !!variants.length && variants.every(({ name }) => {
			return name && name.indexOf(string) === 0
		})
	}

	let numChars = 0, currentString = ``, stringInCommon = ``

	while (hasStringInCommon(currentString)) {
		stringInCommon = currentString
		let { name = `` } = variants[0] || {}
		currentString = name.substring(0, ++numChars)
	}

	return variants.map(variant => {
		let { name } = variant
		name = name.replace(stringInCommon, ``)
		return { ...variant, name }
	})
}


