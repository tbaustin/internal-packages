
const makeVariableType = ({ mainField, ...schema }) => ({
  type: `object`,
  ...schema,
  fields: [
    mainField,
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
  ],
	options: {
		collapsible: true,
		collapsed: true,
    ...schema.options
	}
})


export const variableCategory = makeVariableType({
	name: `variableCategory`,
	title: `Category or Variable`,
	mainField: {
		name: `category`,
		title: `Choose a category manually`,
		type: `reference`,
		to: [{ type: `category` }]
	}
})


export const variableProductList = makeVariableType({
	name: `variableProductList`,
	title: `List of Products or Variable`,
	mainField: {
		name: `products`,
		title: `Choose the list of products manually`,
    type: `array`,
    of: [{
      type: `reference`,
  		to: [{ type: `baseProduct` }]
    }]
	}
})
