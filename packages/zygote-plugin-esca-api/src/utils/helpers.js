const formatPrice = (price) => {
	return (+price).toLocaleString(`en-US`, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
}

const dollarsToCents = (price) => {
	const centsString = formatPrice(price).replace(/\D/g, ``)
	const centsNum = +centsString
	return centsNum
}

const centsToDollars = (price) => {
	const dollars = +price / 100
	return dollars
}

export {
	dollarsToCents,
	centsToDollars
}