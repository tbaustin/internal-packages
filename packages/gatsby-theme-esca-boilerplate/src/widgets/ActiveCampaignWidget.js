import React, { useEffect } from 'react'
import { activeCampaign } from 'config'

const { account } = activeCampaign


export default function ActiveCampaignWidget(props) {
	const { formId } = props

	useEffect(() => {
		const formScript = document.createElement(`script`)
		formScript.src = `https://${account}.activehosted.com/f/embed.php?id=${formId}`
		formScript.type = `text/javascript`
		formScript.charset = `utf-8`

		document.head.appendChild(formScript)

		return () => {
			formScript.parentNode.removeChild(formScript)
		}
	})

	return formId
		?	<div className={`_form_${formId}`} />
		: <div>Form ID must be provided.</div>
}
