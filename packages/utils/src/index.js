import _get from 'lodash/get'
import _set from 'lodash/set'


export * from './currency'
export * from './getGatsbyImage'


/**
 * Converts a graph structure to an Array containing the graph's original nodes
 */
export function graphToArray(graph, path) {
	const { edges = [], nodes: origNodes } = graph || {}

	const nodes = origNodes || edges.map(e => e?.node || {})

	return nodes.map(node => {
		return path ? _get(node, path) : node
	})
}


/**
 * Gets the display name of a React component
 */
export function getComponentName(component) {
	const { displayName, name } = component || {}
	return displayName || name || `Component`
}


/**
 * Trims common beginning characters from each string in a given list
 *
 * List can be an array of strings or objects (looks for string at the given
 * property path for objects)
 */
export const trimCommon = (items = [], propPath = ``) => {
	if (!Array.isArray(items)) return items
	if ([0, 1].includes(items.length)) return items

	const getString = item => {
		if (typeof item === `object`) {
			let value = _get(item, propPath || `name`)
			return value || ``
		}
		return typeof item === `string` ? item : ``
	}

	const setString = (item, string) => typeof item === `object`
		? _set(item, propPath || `name`, string)
		: string

	const hasInCommon = string => {
		return items.length && items.every(item => {
			const itemString = getString(item)
			return itemString.indexOf(string) === 0
		})
	}

	const first = getString(items[0])

	/**
	 * If all strings are the same, return the original array
	 * Otherwise, infinite while loop occurs below
	 */
	const allSame = items.every(item => getString(item) === first)
	if (allSame) return items

	let numChars = 0, current = ``, common = ``

	while (hasInCommon(current)) {
		common = current
		current = first.substring(0, ++numChars)
	}

	return items.map(item => {
		let string = getString(item)
		string = string.replace(common, ``)
		return setString(item, string)
	})
}



/**
 * Combines multiple arrays of objects into one
 * Objects w/ matching values for given key are spread together
 *
 * Each array can be a different length and/or have objects with IDs (values
 * for given key) that aren't present in the other arrays
 *
 * Result will include every ID that appears at least once
 */
export function combineArrays(key, ...arrays) {
	// ID (value for given key) of every object in every supplied array
	const allIds = [].concat(...arrays).map(v => v?.[key]).filter(Boolean)
	// Remove duplicates from above
	const uniqueIds = [ ...new Set(allIds) ]
	/**
   * The "starting point" array of objects
   * Each object contains only an ID value at the key specified in 1st arg
   * Has every ID that is present in any of the supplied arrays
   */
	const baseArray = uniqueIds.map(id => ({ [key]: id }))

	// Merge objects from other arrays w/ objects in starting point array
	return arrays.reduce((combined, curr) => {
		const array = Array.isArray(curr) ? curr : []

		return combined.map(item => {
			const matchingItem = array.find(el => el?.[key] === item?.[key])
			return { ...item, ...matchingItem }
		})
	}, baseArray)
}
