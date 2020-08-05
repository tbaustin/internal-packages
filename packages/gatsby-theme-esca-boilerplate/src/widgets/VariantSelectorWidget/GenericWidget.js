import React from 'react'
import Select from '../../components/select'


export default function GenericWidget(props) {
	const { options: optionsProp, ...other } = props

	const options = optionsProp.map(option => {
		const { sku, value } = option
		return {
			label: value,	// Ugh...bad naming
			value: sku,
			disabled: !sku
		}
	})

	options.sort((a, b) => (a.value - b.value))

	return <Select options={options} {...other} />
}
