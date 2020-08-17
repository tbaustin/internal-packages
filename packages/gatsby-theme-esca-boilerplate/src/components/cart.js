import React, { useEffect } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { Cart as Zygote, standardPayment } from '@escaladesports/zygote-cart'
import * as zygoteActiveCampaign from 'zygote-plugin-active-campaign'
import * as zygoteEscaApi from '@escaladesports/zygote-plugin-esca-api'
import { activeCampaign as acConfig } from 'config'


const query = graphql`
	query CartQuery {
		siteSettings: sanitySiteSettings {
			title
		}
	}
`

const reCaptchaKey = process.env.GATSBY_CART_RECAPTCHA_KEY
const reCaptchaScoreThreshold = process.env.GATSBY_CART_RECAPTCHA_THRESHOLD
const reCaptchaProps = !reCaptchaKey ? {} : {
	reCaptchaKey, reCaptchaScoreThreshold,
}


export default function Cart() {
	const { siteSettings } = useStaticQuery(query)
	const cartHeaderText = siteSettings?.title || `Escalade Sports`

	// Initialize ActiveCampaign functionality on 1st render
	useEffect(() => {
		zygoteActiveCampaign.init(
			{
				serviceName: acConfig.integrationName,
				serviceLogoUrl: acConfig.integrationLogo,
				proxyUrl: `${acConfig.origin}/api/3/`,
				origin: acConfig.origin,
				host: acConfig.host
			},
			{
				proxyDevUrl: `${acConfig.devOrigin}/dev/api/3/`,
				devOrigin: acConfig.devOrigin,
				isDevMode: acConfig.devMode,
				isLogging: acConfig.devMode
			},
			{
				acceptsMarketing: true,
				color: `#000000`,
				text: `I would like to receive emails and updates about my order and`
					+	` special promotions`,
				hasFullImageUrl: true,
				addAbandonedTag: true
			},
			{
				abandonOffset: 30
			},
			{
				// This will clear the contact from the automations
				clearAutomations: true
			}
		)
	}, [])

	return (
		<Zygote
			styles={{
				borderColor: `#c8202e`,
				primaryColor: `#c8202e`,
				overlayColor: `rgba(200, 32, 46, .5)`,
			}}
			header={<h1>{cartHeaderText}</h1>}
			cartHeader={<div>Shopping Cart</div>}
			infoWebhook="/api/inventory/load"
			splitName={true}
			plugins={[
				standardPayment,
				zygoteEscaApi,
				zygoteActiveCampaign
			]}
			customerServiceTel="800-694-9494"
			{...reCaptchaProps}
			totalModifications={[
				{
					id: `shipping`,
					description: `Shipping`,
					displayValue: `-`,
				},
				{
					id: `tax`,
					description: `Tax`,
					displayValue: `-`,
				},
			]}
		/>
	)
}
