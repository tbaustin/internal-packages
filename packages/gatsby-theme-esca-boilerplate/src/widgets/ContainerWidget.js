import React from 'react'
import ContentRenderer from './index'
import Container from '../components/container'


export default function ContainerWidget(props) {
	const { content, ...other } = props

	return (
		<Container
			component={ContentRenderer}
			blocks={content}
			{...other}
		/>
	)
}
