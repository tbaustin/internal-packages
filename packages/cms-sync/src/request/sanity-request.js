import axios from 'axios'

export default async (options) => {
	const {
		body,
		projectId,
		dataset,
		type,
		endpoint,
		contentType,
		meta,
		params = ``,
		apiKey,
	} = options

	try {
		const res = await axios({
			method: `post`,
			url: `https://${projectId}.api.sanity.io/v1/${endpoint}/${type}/${dataset}${params}`,
			data: body,
			maxContentLength: `Infinity`,
			headers: {
				"Content-Type": contentType || `application/json`,
				Authorization: `Bearer ${process.env.SANITY_TOKEN || apiKey}`,
			},
		})
		if(res && res.data){
			if(meta){
				return { ...meta, data: res.data }
			}
			return res.data
		} else {
			return res
		}
		
	} catch(e){
		if(e.response){
			// console.log(`Sanity Error: `, e.response.data)
			return e.response.data
		} else {
			// console.log(`Sanity Error: `, e)
			return e
		}
	}
}




