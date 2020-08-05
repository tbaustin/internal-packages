import React from 'react'
import { Cart as ZygoteCart } from '@escaladesports/zygote-cart'
import * as escaApi from '@escaladesports/zygote-plugin-esca-api'
import * as standardPayment from '@escaladesports/zygote-cart/dist/plugins/zygote-plugin-standard-billing'


export default function Cart() {
	return (
		<ZygoteCart
			styles={{
				borderColor: `#c8202e`,
				primaryColor: `#c8202e`,
				overlayColor: `rgba(200, 32, 46, .5)`,
			}}
			header={<h1>Lifeline Fitness</h1>}
			cartHeader={<div>Shopping Cart</div>}
			infoWebhook='/api/inventory/load'
			splitName={true}
			plugins={[ standardPayment, escaApi ]}
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
