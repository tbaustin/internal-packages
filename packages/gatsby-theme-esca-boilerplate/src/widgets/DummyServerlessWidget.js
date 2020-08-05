import React, { useState, useEffect } from 'react'


/**
 * Dummy component to make sure Netlify functions are working
 */
export default function DummyServerlessWidget(props) {
	const [ dummy, setDummy ] = useState()

	useEffect(() => {
		const fetchDummy = async () => {
			const response = await fetch(`/.netlify/functions/dummy`)
			const data = await response.json()
			const { message } = data || {}
			if (message) setDummy(message)
		}

		if (!dummy) fetchDummy()
	}, [dummy])

	return !dummy ? null : (
		<p>
      Message returned from dummy serverless function:&nbsp;
			<strong>{dummy}</strong>
		</p>
	)
}
