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
