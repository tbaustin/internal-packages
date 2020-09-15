

export const numberOrVariable = Rule => Rule.required().custom(price => {
  const regex = /^{{.+}}$|^\d+$|^\d+\.\d+$/
  const message = (
    `Please enter a number or a variable in double curly braces.`
  )
  return regex.test(price) || message
})


export const aspectRatio = Rule => Rule.custom(value => {
  const regex = /^[1-9]{1}\d*:[1-9]{1}\d*$/
  const message = `Please enter a valid aspect ratio. Example: '16:9' or '4:3'`
  return regex.test(value) || !value || message
})


/**
 * Validation function for the path field
 * Can contain template variable syntax in the template schema
 */
export const path = ({ template, required }) => Rule => {
	let message = (
		`Must start with a slash and ` +
    `cannot contain spaces or special characters.`
	)

	if (template) message += ` Double curly braces for variables are allowed.`

  const requiredRule = Rule.required()

  const templateRegexRule = Rule.custom(path => {
    const regex = /^\/[\w\d\-\_\/]*$/
    const templatePath = path?.replace(/{{[^{}]+}}/g, `TEMPLATE_VALUE`)
    const valid = regex.test(template ? templatePath : path)
    return !path || valid || message
  })

	const rules = [ templateRegexRule ]
  required && rules.push(requiredRule)
  return rules
}
