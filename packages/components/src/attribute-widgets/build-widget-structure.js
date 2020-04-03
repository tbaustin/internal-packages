import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'


export default function buildWidgetStructure(...args) {
	const [currentVariant, variants, config] = args
	const widgets = cloneDeep(config)
	const attributes = Object.keys(widgets)

	/**
   * Find a variant that has:
   *  - The given value (option) for the given attribute
   *  - The current variant's values for all other attributes
   */
	const getVariantForOption = (attribute, option) => {
		// All other attributes besides current passed to function
		// i.e. would contain `color` if the current attribute is `size`
		const otherAttributes = attributes.filter(a => a !== attribute)

		// Products that have the passed option for the passed attribute
		const variantsWithOption = variants.filter(v => {
			return isEqual(v[attribute], option)
		})

		// If there's only 1 variant with the passed option, just use that variant
		// (or else customer would have no way to navigate to it)
		if (variantsWithOption.length === 1) return variantsWithOption[0]

		/**
		 * Otherwise, find a variant that has the same values as the current variant
		 * for all other attributes
		 */
		return variantsWithOption.find(variant => {
			return otherAttributes.every(attr => {
				/**
				 * If either the current variant or variant being compared against
				 * doesn't have a value for the attribute at all, count this as a match
				 */
				let ignored = !variant[attr] || !currentVariant[attr]
				return isEqual(variant[attr], currentVariant[attr]) || ignored
			})
		})
	}

	/**
   * Push all the options into the attributes
   * Each option has a value and the ID of the variant it would lead to if it
	 * were selected by the user
   *
   * Variant ID will be undefined if no variant exists with that combination
   * This can be used to either hide the option or disable it
   */
	for (let variant of variants) {
		for (let property in variant) {
			// Skip properties that don't represent attributes
			if (!(property in widgets)) continue

			let value = variant[property]
			let { options } = widgets[property] || {}

			// Skip if the option has already been pushed
			let exists = !!options.find(op => isEqual(op.value, value))
			if (exists) continue

			// Get the SKU of the variant having the option
			let { sku } = getVariantForOption(property, value) || {}

			// Finally, push the option
			options.push({ value, sku })
		}
	}

	return widgets
}
