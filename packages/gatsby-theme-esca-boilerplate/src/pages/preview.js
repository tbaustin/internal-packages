import React, { useEffect, useState } from 'react'
import { Router } from '@reach/router'
import sanityClient from '@sanity/client'
import Template from '../main-template'

import {
	sanityProjectId,
	sanityDataset,
} from 'config'

const client = sanityClient({
	projectId: sanityProjectId,
	dataset: sanityDataset,
	useCdn: false,
	withCredentials: true,
})

function PreviewPage(props){
	const [data, setData] = useState()

	useEffect(() => {
		async function fetchData() {
			const res = await client.fetch(`*[_id == "${props.document}"]`)
			setData(res)
		}
		fetchData()
	}, [])
  
	console.log(data)

	if(!data) return <div>No Data Found</div>
	const content = Array.isArray(data) ? data[0] : data
	if (content._type === `page`) {
		return <div>Title: {content.title}</div>
		// return (
		// 	<Template pageContext={data} />
		// )
	}
	return (
		<div>Page previews not supported for this content type.</div>
	)
}
export default function Preview(){
	return (
		<div>
			<Router>
				<PreviewPage path='/preview/:document' />
			</Router>
		</div>
	)
}