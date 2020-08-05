import produce from 'immer'


/**
 * These functions are used to create an on-the-fly patched version of the
 * data source & schema passed to a template
 *
 * Some of the fields/structures defined in the schema are either not intuitive
 * for a CMS user to remember or aren't possible for the template engine to
 * resolve out of the box, so they are modified here with some "pretend" fields
 * before actually being sent to the template engine
 */


/**
 * To set/hold "pretend" versions of the custom fields that are formatted like
 * ordinary schema fields used in object types
 */
let patchedCustomFields = []

const setPatchedCustomFields = customFields => {
  const patched = customFields?.map((field, i) => ({
    ...field,
    ...field.fieldType === `images` && { type: `array` },
    name: `customField${i}`,
    title: field?.name
  }))
  patchedCustomFields = patched
  return patched
}


/**
 * To set/hold the Salsify property name chosen to be used for product names
 */
let productNameKey = ``

const setProductNameKey = customFields => {
  const productNameField = customFields?.find?.(field => field?.useAsName)
  productNameKey = productNameField?.salsifyName
  return productNameKey
}


/**
 * Gets the customFieldEntry value for the given custom field within the given
 * product
 */
const getCustomFieldValue = (field, product) => {
  const { name, title, salsifyName, fieldType } = field || {}
  const entries = product?.customFieldEntries || []

  if (salsifyName && fieldType !== `images`) {
    return product.salsify?.[salsifyName]
  }

  const foundEntry = entries.find(e => e.fieldName === title)
  return foundEntry?.fieldValue?.[fieldType]
}


/**
 * Holds functions to be used to patch data for different document types
 */
let dataPatchers = {}


/**
 * Patches a baseProduct document to fit the patched schema (see below)
 */
dataPatchers.baseProduct = data => produce(data, draft => {
  // Turn 'customFieldEntries' array into plain 'customFields' object
  draft.customFields = {}

  for (let field of patchedCustomFields) {
    let { name, salsifyName, useAsName } = field

    let valueInBaseProduct = getCustomFieldValue(field, draft)
    draft.customFields[name] = valueInBaseProduct

    /**
     * If this custom field is the Salsify property chosen to be used for
     * product names, then also set its value at a more convenient 'name'
     * property directly on the product (reflected in patched schema as well)
     */
    if (useAsName) draft.name = valueInBaseProduct

    for (let variant of draft.variants) {
      /**
       * Turn 'customFieldEntries' array into plain 'customFields' object for
       * variants as well
       */
      if (!variant.customFields) variant.customFields = {}

      let valueInVariant = getCustomFieldValue(field, variant)
      variant.customFields[name] = valueInVariant

      // Set convenient 'name' property on variants as well
      if (useAsName) variant.name = valueInVariant
    }
  }

  // Put the current variant under its own property for easy access
  draft.currentVariant = draft.variants.find(v => v.sku === draft.currentSku)
})


/**
 * To patch the schema itself
 * Adds "pretend" fields that are more intuitive for CMS users to use
 *
 * FOR PRODUCTS:
 *    'Name' is the value of whichever custom field/Salsify property is chosen
 *    to be used as the product name
 *
 *    'Custom Fields' is an object-like version of the custom field entries
 *    where a custom field value can be accessed with 'Custom Fields:Field Name'
 *
 *    'Price' and 'Stock' are self-explanatory and come from the product service
 *
 *    'Current Variant' accesses all available fields on the variant the
 *    customer is currently viewing
 *
 */
const schemaPatcher = schema => {
  return produce(schema, draft => {
    const productTypes = draft.filter(t => {
      return [`baseProduct`, `variant`].includes(t.name)
    })
    for (let type of productTypes) {
      if (!Array.isArray(type?.fields)) continue

      type.fields.push(
        {
          title: `Name`,
          name: `name`,
          type: `string`
        },
        {
          title: `Custom Fields`,
          name: `customFields`,
          type: `object`,
          fields: patchedCustomFields
        }
      )

      type.name === `variant` && type.fields.push(
        {
          title: `Price`,
          name: `price`,
          type: `number`
        },
        {
          title: `Stock`,
          name: `stock`,
          type: `number`
        }
      )

      type.name === `baseProduct` && type.fields.push(
        {
          title: `Current Variant`,
          name: `currentVariant`,
          type: `variant`
        }
      )
    }
  })
}


export default function patchTemplateData(options) {
  const { data, schema, customFields } = options

  // Only try to patch & set custom fields if they're provided
  if (customFields) setPatchedCustomFields(customFields)

  const patchedSchema = schemaPatcher(schema)
  const dataPatcher = dataPatchers[data?._type]
  const patchedData = dataPatcher?.(data) || data

  return { patchedData, patchedSchema }
}
