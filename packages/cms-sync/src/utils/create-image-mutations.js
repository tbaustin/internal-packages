import { nanoid } from 'nanoid'

export default function createImageMutation({ apiImages, cmsImages, name }) {
	// images that exists in the cms but not in the api
	const imagesToDelete = cmsImages?.filter?.(({ externalUrl }) => {
		return !apiImages?.find?.(apiUrl => apiUrl === externalUrl)
	})

	// images that exists in the api but not in the cms
	const imagesToAdd = apiImages?.filter?.(apiUrl => {
		return !cmsImages.find(({ externalUrl }) => externalUrl === apiUrl)
	})
	
	const mutation = {}

	// get the indexes of images that need to be deleted
	if(imagesToDelete?.length){
		const idxs = imagesToDelete.reduce((acc, cur) => {
			const idx = cmsImages.findIndex(({ externalUrl }) => externalUrl === cur.externalUrl)
			if(idx !== -1) acc.push(idx)
			return acc
		}, [])
	
		if(idxs?.length){
			// if indexes are found pass those through the unset function
	
			mutation.unset = [`customFieldEntries[fieldName == "${name}"].fieldValue.images[${idxs.join(`,`)}]`]
		}
	}
	
	if(imagesToAdd?.length && !cmsImages?.length) {
		// if there are no current images add all the images
		// unset any empty arrays to prevent duplicate custom
		// fields

		mutation.unset = [`customFieldEntries[fieldName == "${name}"]`]
		mutation.insert = {
			after: `customFieldEntries[-1]`,
			items: [{
				fieldName: name,
				fieldValue: { images: imagesToAdd.map(url => ({ 
					_key: nanoid(), 
					_type: `customFieldImage`,
					externalUrl: url })) },
			}],
		}

	} else if(imagesToAdd?.length) {
		// just need to add any new images here, insert them at the end

		mutation.insert = {
			after: `customFieldEntries[fieldName == "${name}"].fieldValue.images[-1]`,
			items: imagesToAdd.map(url => ({ 
				_key: nanoid(),
				_type: `customFieldImage`, 
				externalUrl: url, 
			})),
		}
	}

	return mutation
}