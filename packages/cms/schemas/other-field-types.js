import makeVariableType from '../make-variable-type'


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
