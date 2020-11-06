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

const identicalStrings = [
	`All the same`,
	`All the same`,
	`All the same`
]

const description = `
  Trims common beginning characters from each string in a given list
`

test(description, () => {
	expect(trimCommon(`blah`)).toBe(`blah`)
	expect(trimCommon(null)).toBeNull()

	const result1 = trimCommon(sample1)
	expect(result1).toBeInstanceOf(Array)
	expect(result1).toHaveLength(4)
	expect(result1).toEqual(expect.arrayContaining(sample1Expected))

	const result2 = trimCommon(sample2, `strings[0]`)
	expect(result2).toBeInstanceOf(Array)
	expect(result2).toHaveLength(4)
	expect(result2).toEqual(expect.arrayContaining(sample2Expected))

	const result3 = trimCommon([])
	expect(result3).toBeInstanceOf(Array)
	expect(result3).toHaveLength(0)

	const result4 = trimCommon([`Only one`])
	expect(result4).toBeInstanceOf(Array)
	expect(result4).toHaveLength(1)
	expect(result4).toEqual(expect.arrayContaining([`Only one`]))

	const result5 = trimCommon(identicalStrings)
	expect(result5).toBeInstanceOf(Array)
	expect(result5).toHaveLength(3)
	expect(result5).toEqual(expect.arrayContaining(identicalStrings))
})
