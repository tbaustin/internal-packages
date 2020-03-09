import axios from 'axios'

export default async function productRequest(options) {
	const {
		site,
		env,
		fields,
		salsify,
		skus,
		url
	} = options

	const endpoint = env === `prod`
		? `https://m570gzyn6h.execute-api.us-east-1.amazonaws.com/production/`
		: `https://7el25d5l16.execute-api.us-east-1.amazonaws.com/dev/`

	const { data } = await axios({
		method: `post`,
		url: endpoint,
		data: {
			data: {
				fields,
				salsify,
				skus: skus || `all`,
			},
			site,
			url,
		},
		headers: {
			"Content-Type": `application/json`,
		},
	})

	return data.products
}
