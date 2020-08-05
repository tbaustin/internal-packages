import S from '@sanity/desk-tool/structure-builder'
import categoriesSection from './categories-section'
import productsSection from './products-section'
import settingsSection from './settings-section'


/**
 * All document types that have a special UI or should be hidden
 * Don't include the default menu items for these
 */
const hiddenDocumentTypes = [
	`category`,
	`persistedSchema`,
	`baseProduct`,
	`variant`,
	`siteSettings`,
]


export default () => S.list()
	.title(`Content`)
	.items([
		categoriesSection,
		productsSection,
		settingsSection,
		/**
     * Exclude document types above from menu items
     */
		...S.documentTypeListItems().filter(item => {
			const id = item.getId()
			return !hiddenDocumentTypes.includes(id)
		}),

	])
