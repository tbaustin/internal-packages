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

const centsToDollars = (n) => {
	if(!n) return 0
	let str = n.toString()
	str = str.substring(0, str.length - 2) + `.` + str.substring(str.length - 2)
	return Number(str)
}

export {
	dollarsToCents,
	centsToDollars,
}