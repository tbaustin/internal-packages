import S from '@sanity/desk-tool/structure-builder'
import client from 'part:@sanity/base/client'
import EditIcon from 'part:@sanity/base/edit-icon'


/**
 * Custom menu item list for categories; adds a pencil icon to edit the current
 * category being viewed (next to category title above list of sub-categories)
 */
const categoryMenuItems = id => {
	const customEditButton = S.menuItem()
		.icon(EditIcon)
		.title(`Edit Category`)
		.showAsAction({ whenCollapsed: true })
		.intent({
			type: `edit`,
			params: { id, type: `category` },
		})

	const defaultItems = S.documentTypeList(`category`).getMenuItems()
	return [...defaultItems, customEditButton]
}


/**
 * A list of a category's sub-categories; opens when the category is clicked
 */
const subCategoryList = async (categoryId) => {
	const category = await client.getDocument(categoryId)
	const { name } = category || {}

	return S.documentTypeList(`category`)
		.title(name || `Untitled Category`)
		.filter(`parent._ref == $categoryId`)
		.params({ categoryId })
		.menuItems(categoryMenuItems(categoryId))
		.canHandleIntent(() => false)
		.initialValueTemplates([
			S.initialValueTemplateItem(
				`subCategory`,
				{ parentCategoryId: categoryId },
			),
		])
		.child(subCategoryList)
}


/**
 * Far-left menu item for categories; opens top-level category list
 */
export default S.listItem().title(`Categories`).child(
	S.documentTypeList(`category`)
		.title(`Categories`)
	// Only show top-level categories (no parent) at this level
		.filter(`_type == "category" && !defined(parent)`)
	// Stops odd behavior with panes when creating/editing
		.canHandleIntent(() => false)
		.child(subCategoryList),
)
