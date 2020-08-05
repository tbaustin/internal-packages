import React from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core'
import { colors } from '../styles/variables'


export default function CallToAction(props){
	const {
		text,
		link,
		bgColor,
		textColor,
		css: override,
		margin,
		...other
	} = props

	const styles = css`
    color: ${textColor || colors.textLight};
    background-color: ${bgColor || colors.brand};
    text-decoration: none;
    padding: 20px 40px;
    font-size: 18px;
		font-weight: bold;
    margin: ${margin || `20px`};
    text-transform: uppercase;
    cursor: pointer;
  `

	const Tag = link ? Link : `div`
	const tagProps = {
		css: [styles, override],
		...link && { to: link }
	}

	return (
		<Tag {...tagProps} {...other}>
			{text}
		</Tag>
	)
}
