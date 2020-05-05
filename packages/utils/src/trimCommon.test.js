import { trimCommon } from './index'


const sample1 = [
	`Virtuous Contract`,
	`Virtuous Treaty`,
	`Virtuous Dignity`,
	`Virtuous Grief`,
]

const sample1Expected = [`Contract`, `Treaty`, `Dignity`, `Grief`]

const sample2 = [
	{ strings: [`Cruel Oath`] },
	{ strings: [`Cruel Blood Oath`] },
	{ strings: [`Cruel Arrogance`] },
	{ strings: [`Cruel Lament`] },
]

const sample2Expected = [
	{ strings: [`Oath`] },
	{ strings: [`Blood Oath`] },
	{ strings: [`Arrogance`] },
	{ strings: [`Lament`] },
]

const description = `
  Trims common beginning characters from each string in a given list
`

test(description, () => {
	const result1 = trimCommon(sample1)
	expect(result1).toBeInstanceOf(Array)
	expect(result1).toHaveLength(4)
	expect(result1).toEqual(expect.arrayContaining(sample1Expected))

	const result2 = trimCommon(sample2, `strings[0]`)
	expect(result2).toBeInstanceOf(Array)
	expect(result2).toHaveLength(4)
	expect(result2).toEqual(expect.arrayContaining(sample2Expected))
})
