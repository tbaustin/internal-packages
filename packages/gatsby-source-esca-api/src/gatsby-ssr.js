import React from 'react'
import { WithProducts } from '@escaladesports/react-esca-api'

export function wrapRootElement({ element }) {
	return (
		<WithProducts>
			{element}
		</WithProducts>
	)
}