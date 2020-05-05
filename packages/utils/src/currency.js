// Strips a string of characters not used for numbers
const stripNonNumerics = numOrStr => `${numOrStr}`.replace(/[^\d.-]/g, ``)


/**
 * Returns number as US currency formatted string
 * Takes a number or numeric string
 * Returns empty string if input is not valid
 * For examples, see README.md and currency.test.js
 */
export function formatPrice(input) {
	const priceString = stripNonNumerics(input)

	const priceNum = Number(priceString)
	const isFalsey = isNaN(priceNum) || !priceString.length
	if (isFalsey) return ``

	return priceNum.toLocaleString(`en-US`, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
		style: `currency`,
		currency: `USD`,
	})
}


/**
 * Converts a US currency formatted string to a number
 * Takes number or numeric string as input (always returns number)
 * Returns null if input is not valid
 * For examples, see README.md and currency.test.js
 */
export function unformatPrice(input) {
	const priceString = stripNonNumerics(input)
	const priceNum = Number(priceString)
	const isFalsey = isNaN(priceNum) || !priceString.length

	return isFalsey ? null : priceNum
}


/**
 * Converts dollars to cents (multiplies by 100)
 * Takes number or numeric string as input
 * Returns null if input is not valid
 * For examples, see README.md and currency.test.js
 */
export function toCents(dollars) {
	const num = unformatPrice(dollars)
	if (num === null) return num
	return Math.round(num * 100)
}


/**
 * Converts cents to dollars (divides by 100)
 * Takes number or numeric string as input, 2nd argument optional to enable
 * output formatted as currency
 *
 * If 2nd argument is truthy, returns US currency formatted string for valid
 * input or empty string for invalid input
 *
 * If 2nd argument is falsey (default), returns number for valid input or null
 * for invalid input
 *
 * For examples, see README.md and currency.test.js
 */
export function toDollars(centsInput, shouldFormat) {
	const centsNum = unformatPrice(centsInput)
	const dollars = (centsNum / 100).toFixed(2)

	if (centsNum === null) {
		return shouldFormat ? `` : null
	}

	return shouldFormat ? formatPrice(dollars) : Number(dollars)
}
