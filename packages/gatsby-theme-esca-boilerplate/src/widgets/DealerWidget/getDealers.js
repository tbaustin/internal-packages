import axios from 'axios'

export default async function(city, state, radius) {
	const { data } = await axios({
		method: `POST`,
		url: `/api/dealers/proximity`,
		data: {
			city,
			state,
			dist: radius,
			fields: [ 
				`location`,
			],
		},
	})

	return data?.dealers 
}