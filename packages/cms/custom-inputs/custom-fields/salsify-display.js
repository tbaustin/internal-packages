/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/core'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { useApiProduct } from '../../cached-async-data'
import * as styles from './styles'


const AttributeIcon = () => (
	<span css={styles.attributeIcon}>
    &#9679;
	</span>
)

const AttributeIconLegend = () => (
	<div css={styles.legend}>
		<AttributeIcon />
    &nbsp;
		<em>denotes customer-filterable product attribute</em>
	</div>
)


/**
 * "Salsify fields" section of custom fields
 *
 * Renders a default Sanity fieldset w/ inner table displaying:
 *  - Names of all custom fields that have Salsify property names set
 *  - This product's values for them (from Esca API)
 */
export default function SalsifyDisplay(props) {
	const { product, customFields } = props
	const apiProduct = useApiProduct(product)

	/**
   * Only use fields that have a Salsify property name set
   * Excludes image list custom field types, as they have their own section
   * Sort by Salsify property name
   */
	const salsifyFields = customFields
		.filter(f => f?.salsifyName && f?.fieldType !== `images`)
		.sort((a, b) => a?.salsifyName > b?.salsifyName ? 1 : -1)

	// Puts all Salsify fields from a variant into their own object
	const getVariantSalsifyFields = variant => {
		const fieldNames = Object.keys(variant || {})
			.filter(key => salsifyFields.find(f => f?.salsifyName === key))

		return fieldNames.reduce((obj, key) => {
			return { ...obj, [key]: apiProduct[key] }
		}, {})
	}

	// Get Salsify field values from Esca API product data
	const salsifyValues = product._type === `baseProduct`
		? (apiProduct?.salsify || {})
		: getVariantSalsifyFields(apiProduct)
    
	const hasSalsifyValues = !!Object.values(salsifyValues).length

	return !hasSalsifyValues ? null : (
		<Fieldset css={styles.fieldset} legend="Custom Fields (Salsify)">
			<AttributeIconLegend />
			{salsifyFields?.map(field => {
				const { name, _id, salsifyName, attributeWidget } = field
				const value = salsifyValues[salsifyName]

				return !value ? null : (
					<div key={_id}>
						<div css={styles.fieldLabel}>
							{attributeWidget && (
								<>
									<AttributeIcon />
                  &nbsp;
								</>
							)}
							{name}
						</div>
						<div css={styles.fieldValue}>
							{value}
						</div>
					</div>
				)
			})}
		</Fieldset>
	)
}
