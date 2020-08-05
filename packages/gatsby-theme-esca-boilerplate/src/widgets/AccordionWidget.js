import React, { useState } from 'react'
import {
	Accordion,
	AccordionItem,
	AccordionItemHeading,
	AccordionItemButton,
	AccordionItemPanel,
} from 'react-accessible-accordion'
import 'react-accessible-accordion/dist/fancy-example.css'
import { css } from '@emotion/core'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import SanityBlock from './index'
import Container from '../components/container'
import { colors } from '../styles/variables'


export const cmsId = `accordion`

export default function AccordionModule(props){
	const { rows } = props

	const [active, setActive] = useState({})

	return(
		<Container width="constrained" smartPadding>
			<Accordion
				allowZeroExpanded={true}
				allowMultipleExpanded={true}
				css={accordionStyles}
				onChange={(uuid) => {
					if(!uuid.length) setActive({})

					uuid.forEach(id => {
						setActive({
							[id]: true,
						})
					})
				}}>
				{rows.map((row, index) => {
					return (
						<AccordionItem key={index} uuid={index}>
							<AccordionItemHeading>
								<AccordionItemButton>
									<span>{row.label}</span>
									<span className={`plusIcon`}>
										{
											active[index]
												? <IoIosArrowUp />
												: <IoIosArrowDown />
										}
									</span>
								</AccordionItemButton>
							</AccordionItemHeading>
							<AccordionItemPanel>
								<SanityBlock blocks={row.content} />
							</AccordionItemPanel>
						</AccordionItem>
					)
				})}
			</Accordion>
		</Container>
	)
}


const accordionStyles = css`
	width: 100%;

	.accordion__button {
		background: ${colors.white};
		color: ${colors.grey};
		display: flex;
    justify-content: space-between;
    :focus {
      border: none;
      outline: none;
    }
		:before {
			display: none;
		}
		.plusIcon {
			font-size: 22px;
		}
	}
`
