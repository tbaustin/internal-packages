import React from 'react'
import Accordion, { AccordionItem } from '../components/accordion'
import SanityBlock from './index'


export default function AccordionWidget(props) {
	const { rows, _key: accordionId } = props

	return (
		<Accordion>
			{rows?.map?.((row, index) => {
				const { label, content } = row || {}
				const key = `accordion-${accordionId}-${index}`

				return (
					<AccordionItem key={key} id={key} heading={label}>
						{content && (
							<SanityBlock blocks={content} />
						)}
					</AccordionItem>
				)
			})}
		</Accordion>
	)
}
