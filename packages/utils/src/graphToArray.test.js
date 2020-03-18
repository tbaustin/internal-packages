import { graphToArray } from './index'


const graph1 = {
	edges: [
		{ node: `test1` },
		{ node: `test2` },
		{ node: `test3` },
	],
}

const graph2 = {
	edges: [
		{
			node: {
				frontmatter: {
					firstName: `Spike`,
					lastName: `Spiegel`,
				},
			},
		},
		{
			node: {
				frontmatter: {
					firstName: `Faye`,
					lastName: `Valentine`,
				},
			},
		},
	],
}

const graph3 = {
	edges: [{
		node: {
			frontmatter: {
				people: [{ name: `Jet Black` }],
			},
		},
	}],
}


const description = `Converts a graph structure to an Array containing `
  + `the graph's original nodes`


test(description, () => {
	const result1 = graphToArray(graph1)
	expect(result1).toBeInstanceOf(Array)
	expect(result1).toHaveLength(3)

	const result2 = graphToArray(graph2, `frontmatter`)
	expect(result2).toBeInstanceOf(Array)
	expect(result2).toHaveLength(2)
	expect(result2[0]).toMatchObject({
		firstName: `Spike`,
		lastName: `Spiegel`,
	})

	const result3 = graphToArray(graph3, `frontmatter.people[0].name`)
	expect(result3).toBeInstanceOf(Array)
	expect(result3).toHaveLength(1)
	expect(result3[0]).toBe(`Jet Black`)

	const result4 = graphToArray(null, `test`)
	expect(result4).toBeInstanceOf(Array)
	expect(result4).toHaveLength(0)
})
