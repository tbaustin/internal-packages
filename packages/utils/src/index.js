import _get from 'lodash/get'
import _set from 'lodash/set'


export * from './currency'


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

	let numChars = 0, current = ``, common = ``
	const first = getString(items[0])

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
