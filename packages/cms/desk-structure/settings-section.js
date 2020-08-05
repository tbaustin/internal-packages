import S from '@sanity/desk-tool/structure-builder'
import client from 'part:@sanity/base/client'


const defaultSettings = {
	description: `Description here`,
	siteId: `Site ID here`,
	title: `Site Title here`,
	navigation: [],
	_id: `siteSettings`,
	_type: `siteSettings`,
}

!async function ensureSettings() {
	console.log(`Checking for existing site settings...`)
	const existingSettings = await client.getDocument(`siteSettings`)

	if (!existingSettings) {
		console.log(`No site settings found. Using default settings...`)
		client.createIfNotExists(defaultSettings)
	}
}()



export default S.listItem()
	.title(`Settings`)
	.child(
		S.editor()
			.schemaType(`siteSettings`)
			.documentId(`siteSettings`),
	)
