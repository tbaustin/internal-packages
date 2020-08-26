const dirs = require(`./../../dirs`)
const { escaladeSite, apiStages } = require(`${dirs.site}/config`)


// API endpoints used for product data on site
const productsApiPaths = [
	`pricing/load`,
	`inventory/load`,
	`products/load`,
]

// API endpoints used for checkout in cart
const cartApiPaths = [
  `validate/address`,
  `coupon/calculate`,
	`products/shipping`,
	`shipping/load`,
	`orders/store`,
	`pay/paypal`,
	`pay/anet`,
	`taxes/calculate`,
]

// API endpoints use for dealers on the map
const dealerApiPaths = [
	`dealers/proximity`,
	`dealers/all`,
]

const getStage = groupName => {
	const stage = apiStages[groupName] || `prod`
	return stage.toLowerCase()
}


const getApiHeaders = (path, stage) => {
  const suffix = stage === `prod` ? `` : `_${stage.toUpperCase()}`

  return {
    "Content-Type": `application/json`,
    "X-API-Key": process.env[`X_API_KEY${suffix}`],
    "ESC-API-Context": escaladeSite,
    ...path === `orders/store` && {
      "Recaptcha-Secret": process.env.CART_RECAPTCHA_SECRET
    },
    ...path === `taxes/calculate` && {
      "ESC-Tax-Service": `sovos`
    }
  }
}


/**
 * Output redirects formatted for use in netlify.toml (netlify-config.js)
 */
const makeRedirects = (groupName, paths) => paths.map(path => {
	const [ entity, action ] = path.split(`/`)

	const stage = getStage(groupName)
	const stageSuffix = stage === `prod` ? `` : `-${stage}`

	return {
		from: `/api/${path}`,
		to: `https://${entity}${stageSuffix}.escsportsapi.com/${action}`,
		status: 200,
		force: true,
		headers: getApiHeaders(path, stage),
	}
})


const verifyRecaptchaRedirect = {
  from: `/siteverify`,
  to: `https://www.google.com/recaptcha/api/siteverify?secret=`
    + process.env.CART_RECAPTCHA_SECRET,
  status: 200,
  force: true
}


module.exports = [
	...makeRedirects(`products`, productsApiPaths),
	...makeRedirects(`cart`, cartApiPaths),
	...makeRedirects(`dealers`, dealerApiPaths),
	verifyRecaptchaRedirect
]
