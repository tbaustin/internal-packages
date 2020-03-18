import _get from 'lodash/get'


/**
 * Converts a graph structure to an Array containing the graph's original nodes
 */
export function graphToArray(graph, path) {
	const { edges = [] } = graph || {}

	return edges.map(edge => {
		const { node } = edge || {}
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
 * Return formatted price: 2, `2.3` => `$2.00`, `$2.30`
 */

export function formatPrice(price) {
	console.log(price)
}

/**
 * Converts dollars to cents: $3.00 => 300 cents
 */

export function toCents(value) {
	console.log(value)
}

/**
 * Converts cents to dollars: 300 cents => $3.00
 */

