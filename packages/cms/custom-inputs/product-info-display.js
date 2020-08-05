/** @jsx jsx */
import React, { forwardRef } from 'react'
import { jsx, css } from '@emotion/core'
import Fieldset from 'part:@sanity/components/fieldsets/default'
import { withDocument } from 'part:@sanity/form-builder'
import { formatPrice } from '@escaladesports/utils'
import { useApiProduct, useProductNameKey } from '../cached-async-data'


// For "labels" on left side of inner table
const fieldLabelStyle = css`
  padding-right: 16px;
  font-weight: bold;
  text-align: right;
  vertical-align: top;
`

// For value display on right side of inner table
const fieldValueStyle = css`
  max-height: 5rem;
  overflow-y: auto; /* Show scrollbar for longer content */
`


const Row = ({ label, value }) => (
  <tr>
    <td css={fieldLabelStyle}>
      {label}
    </td>
    <td css={fieldValueStyle}>
      {value}
    </td>
  </tr>
)


/**
 * Displays general product information as an uneditable table in a fieldset
 * Shows SKU, price & stock with product name as the fieldset label
 */
export default withDocument(
  forwardRef(function ProductInfoDisplay(props, ref) {
    const { document } = props
    const apiProduct = useApiProduct(document)
    const productNameKey = useProductNameKey()

    const productName = apiProduct?.[productNameKey]

    const legend = productName || `Product Information`
    const displayPrice = formatPrice(apiProduct?.price)

    return (
      <Fieldset legend={legend} ref={ref}>
        <table>
          <tbody>
            <Row label="SKU" value={document?.sku} />
            <Row label="Price" value={displayPrice} />
            <Row label="Stock" value={apiProduct?.stock} />
          </tbody>
        </table>
      </Fieldset>
    )
  })
)
