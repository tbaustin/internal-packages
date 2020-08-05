import React, { useEffect } from 'react'

import { activeCampaignSite } from 'config'

export default function ActiveCampaignWidget(props) {
	const { formId } = props
  
  
	useEffect(() => {
		const formScript = document.createElement(`script`)
		formScript.src = `https://${activeCampaignSite}.activehosted.com/f/embed.php?id=${formId}`
		formScript.type = `text/javascript`
		formScript.charset = `utf-8`

		document.head.appendChild(formScript)
      
		return () => {
			formScript.parentNode.removeChild(formScript)
		}
	})

	if(formId){
		return <div className={`_form_${formId}`} />
	} else {
		return <div>Form Id must be provided</div>
	}
}