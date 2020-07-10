import { nanoid } from 'nanoid'

export default function imageFields(args){
	const { url, sku, name } = args

	return {
		_key: nanoid(), 
		_type: `customFieldImage`,
		externalUrl: url,
		displayed: true, 
		altText: sku || name,
	}
}