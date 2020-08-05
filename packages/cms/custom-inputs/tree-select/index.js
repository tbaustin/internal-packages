import React, { useState, useReducer, useEffect } from 'react'
import PropTypes from 'prop-types'
import client from 'part:@sanity/base/client'
import PatchEvent, { set, unset } from 'part:@sanity/form-builder/patch-event'
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css?raw'
import './style.css?raw'
import buildTree from './build-tree'


const createPatchFrom = value => PatchEvent.from(set(value))


/**
 * Custom tree input for selecting nested categories
 * Uses 3rd party react-dropdown-tree-select as a fully-controlled component
 */
export default React.forwardRef((props, ref) => {
  const { type, value, onChange } = props

  // State to hold the full list of categories after fetch
  const [ categories, setCategories ] = useState([])

  /**
   * State to keep track of which items have their sub-items expanded (needed
   * to make 3rd party tree select work as a fully-controlled component)
   */
  const [ expanded, setExpanded ] = useReducer((state, action) => {
    return { ...state, ...action }
  }, {})

  // Fetch the full list of categories via Sanity client on initial render
  useEffect(() => {
    const query = `*[_type == "category"] { _id, name, parent }`

    client.fetch(query).then(result => {
      // Map to format needed by 3rd party tree select library
      const initialCategories = result.map(cat => ({
        label: cat.name,
        value: cat._id,
        parent: cat.parent?._ref
      }))

      // Have all categories collapsed initially
      const initialExpanded = result.reduce((acc, curr) => {
        return { ...acc, [curr._id]: false }
      }, {})

      setCategories(initialCategories)
      setExpanded(initialExpanded)
    })
  }, [])

  /**
   * Copy of categories w/ added properties for checked, expanded, etc. (based
   * on current states) – needed in order to make 3rd party tree select work as
   * a fully-controlled component
   */
  const categoriesWithInputStates = categories.map(cat => {
    const selectedVals = value?.map(v => v._ref) || []
    const checked = selectedVals.includes(cat.value)
    const isExpanded = expanded[cat.value]
    return { ...cat, checked, expanded: isExpanded }
  })

  // Nest categories into a tree structure based on their 'parent' property
  const categoryTree = buildTree(categoriesWithInputStates, {
    idKey: `value`,
    parentKey: `parent`
  })

  // Overwrite new array of selected references on each change
  const handleChange = (val, selected) => {
    const refs = selected.map(sel => ({
      _ref: sel.value,
      _type: `reference`
    }))
    onChange(createPatchFrom(refs))
  }

  // For expanding/collapsing categories at various levels of the tree
  const handleNodeToggle = node => {
    setExpanded({ [node.value]: node.expanded })
  }

  return (
    <div className="esca-tree-input">
      <div className="esca-tree-input-label">
        Choose Categories
      </div>
      <DropdownTreeSelect
        data={categoryTree}
        ref={ref}
        mode="hierarchical"
        onChange={handleChange}
        onNodeToggle={handleNodeToggle}
      />
    </div>
  )
})
