const variableFields = [
  {
    name: `templateVariable`,
    title: `Use field name`,
    description: `(the data source has a field with the value you want to use)`,
    type: `string`
  },
  {
    name: `useTemplateDataSource`,
    title: `Use template's data source; overrides above`,
    description: `(the data source itself is the value you want to use)`,
    type: `boolean`
  }
]

const variableFieldsForImage = variableFields.map(field => ({
  ...field,
  options: {
    isHighlighted: true
  }
}))


export const makeVariableType = ({ mainField, ...schema }) => ({
  ...schema,
  type: `object`,
  fields: [
    mainField,
    ...variableFields
  ],
	options: {
		collapsible: true,
		collapsed: true,
    ...schema?.options
	}
})


export default makeVariableType


export const makeVariableImageType = schema => ({
  ...schema,
  type: `image`,
  fields: [
    ...schema?.fields || [],
    ...variableFieldsForImage
  ]
})
