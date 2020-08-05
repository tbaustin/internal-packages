import T from '@sanity/base/initial-value-template-builder'


/**
 * Initial value template to pre-fill parent category when creating a new
 * category from within the tree
 */
const subCategoryTemplate = T.template({
  id: `subCategory`,
  title: `Sub-category`,
  schemaType: `category`,
  parameters: [
    {
      name: `parentCategoryId`,
      title: `Parent Category ID`,
      type: `string`
    }
  ],
  value: parameters => ({
    parent: {
      _type: `reference`,
      _ref: parameters.parentCategoryId
    },
    useAncestorsInSlug: true
  })
})


const defaultTemplates = T.defaults().filter(template => {
  /**
   * Don't show "Persisted Schema" or any of the following document types as
   * options in the "Create new" dialog
   */
  const hiddenTypes = [`persistedSchema`, `baseProduct`, `variant`]

  return !hiddenTypes.includes(template.spec.id)
})


export default [ ...defaultTemplates, subCategoryTemplate ]
