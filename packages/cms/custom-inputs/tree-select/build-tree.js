/**
 * Takes an array of objects with references to each other
 * (e.g. via "parent_id" property)
 * Turns the array into a tree w/ original objects nested under their parents
 * (e.g. under "children" property of parent)
 */
export default function buildTree(arr = [], ops = {}) {
  const {
    idKey = `id`, // Main identifier property for element (must be integer)
    parentKey = `parent`, // Property specifying ID of parent
    childrenKey = `children` // Name of prop under which children will be nested
  } = ops

  // Turn into hashmap/dictionary with IDs as keys
  let dict = {}
  arr.forEach(el => {
    dict[el[idKey]] = el
  })

  // Build the tree
  let tree = {}

  for (let key in dict) {
    let el = dict[key]
    let elInTree = tree[key]
    if (!el[parentKey] && !elInTree) {
      tree[key] = el
    }
    else {
      let parentId = el[parentKey]
      if (!dict[parentId][childrenKey]) {
        dict[parentId][childrenKey] = []
      }
      dict[parentId][childrenKey].push(el)
    }
  }

  return Object.values(tree)
}
