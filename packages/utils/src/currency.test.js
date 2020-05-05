import { formatPrice, unformatPrice, toCents, toDollars } from './index'


test(`Formats number or numeric string as US currency`, () => {
	expect(formatPrice(2)).toBe(`$2.00`)
	expect(formatPrice(12.345)).toBe(`$12.35`)
	expect(formatPrice(1000000)).toBe(`$1,000,000.00`)
	expect(formatPrice(0)).toBe(`$0.00`)
	expect(formatPrice(`3.501`)).toBe(`$3.50`)
	expect(formatPrice(`$9,000.01`)).toBe(`$9,000.01`)
	expect(formatPrice(`-9,000.01`)).toBe(`-$9,000.01`)
	expect(formatPrice(`123abc`)).toBe(`$123.00`)
	expect(formatPrice(`godzilla`)).toBe(``)
	expect(formatPrice(``)).toBe(``)
	expect(formatPrice(false)).toBe(``)
	expect(formatPrice(null)).toBe(``)
	expect(formatPrice(undefined)).toBe(``)
})


test(`Converts US currency formatted string to number`, () => {
	expect(unformatPrice(`$3.50`)).toBe(3.5)
	expect(unformatPrice(`$1,000,000.00`)).toBe(1000000)
	expect(unformatPrice(`-$100.00`)).toBe(-100)
	expect(unformatPrice(`$0.00`)).toBe(0)
	expect(unformatPrice(`123.45`)).toBe(123.45)
	expect(unformatPrice(`1,234.5`)).toBe(1234.5)
	expect(unformatPrice(123.45)).toBe(123.45)
	expect(unformatPrice(0)).toBe(0)
	expect(unformatPrice(`Not a price`)).toBeNull()
	expect(unformatPrice(``)).toBeNull()
	expect(unformatPrice(false)).toBeNull()
	expect(unformatPrice(null)).toBeNull()
	expect(unformatPrice(undefined)).toBeNull()
})


test(`Converts dollars to cents`, () => {
	expect(toCents(`$123.45`)).toBe(12345)
	expect(toCents(`1,234.56`)).toBe(123456)
	expect(toCents(`$9,001`)).toBe(900100)
	expect(toCents(-1234.56)).toBe(-123456)
	expect(toCents(0)).toBe(0)
	expect(toCents(`Not a price`)).toBe(null)
	expect(toCents(null)).toBe(null)
	expect(toCents(undefined)).toBe(null)
	expect(toCents(false)).toBe(null)
	expect(toCents({})).toBe(null)
	expect(toCents([])).toBe(null)
})


test(`Converts cents to dollars`, () => {
	expect(toDollars(123)).toBe(1.23)
	expect(toDollars(123, true)).toBe(`$1.23`)

	expect(toDollars(234.56)).toBe(2.35)
	expect(toDollars(234.56, true)).toBe(`$2.35`)

	expect(toDollars(0)).toBe(0)
	expect(toDollars(0, true)).toBe(`$0.00`)

	expect(toDollars(`0.1`)).toBe(0)
	expect(toDollars(`0.1`, true)).toBe(`$0.00`)

	expect(toDollars(`900,001`)).toBe(9000.01)
	expect(toDollars(`900,001`, true)).toBe(`$9,000.01`)

	expect(toDollars(null)).toBe(null)
	expect(toDollars(null, true)).toBe(``)

	expect(toDollars(undefined)).toBe(null)
	expect(toDollars(undefined, true)).toBe(``)

	expect(toDollars(false)).toBe(null)
	expect(toDollars(false, true)).toBe(``)

})
