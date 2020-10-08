/** @jsx jsx */
import React from 'react'
import { jsx } from '@emotion/core'
import Modal from 'part:@sanity/components/dialogs/default'
import { buildSalsifyImageUrl } from '@escaladesports/utils'
import { modalContent as style } from './styles'


export default function Viewer(props) {
	const { isActive, onClose, activeItem } = props

	const imageSrc = buildSalsifyImageUrl(
		activeItem.externalUrl,
		{ width: 1200 },
	)

	return !isActive ? null : (
		<Modal onClose={onClose} onClickOutside={onClose}>
			<div css={style}>
				<img src={imageSrc} />
			</div>
		</Modal>
	)
}
