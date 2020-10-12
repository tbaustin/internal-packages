import React from 'react'
import StyledAccordion from './styled-accordion'
export { default as AccordionItem } from './item'


export default function Accordion(props) {
  const accordionProps = {
    ...props,
    allowZeroExpanded: true,
    allowMultipleExpanded: true
  }

	return <StyledAccordion {...accordionProps} />
}
