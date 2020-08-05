const _omit = require(`lodash/omit`)


module.exports = function buildCategoryAncestry(categories) {
  const addAncestry = category => {
  	let ancestry = [category]

    const addParent = current => {
      const { _ref: parentId } = current.parent || {}

      const parent = categories.find(c => c._id === parentId)

      if (parent) {
        ancestry.unshift(parent)
        addParent(parent)
      }
    }

    addParent(category)
  	return { ...category, ancestry }
  }

  return categories.map(category => {
    const withAncestry = addAncestry(category)
    return _omit(withAncestry, `parent`)
  })
}
