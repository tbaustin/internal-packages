import React, { useState } from 'react'
import { MdStar} from 'react-icons/md'
import { css } from '@emotion/core'

import { colors } from '../../styles/variables'

export default function Stars(props){
	const { field, onChange, ...rest } = props
	const [rating, setRating] = useState(0)
	const [displayRating, setDisplayRating] = useState(rating)

	const eventProps = (idx) => {
		return {
			onClick: () => {
				setRating(idx)
				onChange(idx)
			},
			onMouseOver: () => setDisplayRating(idx),
			onMouseLeave: () => setDisplayRating(rating),
		}
	}

	return (
		<div css={styles} {...rest}>
			{[...Array(5)].map((_, i) => (
				<MdStar 
					{...eventProps(i + 1)}
					key={i}
					className={`ratingStar ${displayRating > i ? `filledStar` : `emptyStar`}`}
				/>
			))}
			{field.helper_text && <p>{field.helper_text}</p>}
		</div>
	)
}

const styles = css`
	.ratingStar {
		height: 50px;
		width: 50px;
		cursor: pointer;
	}
	.emptyStar {
		color: ${colors.grey};
	}
	.filledStar {
		color: ${colors.red};
	}
`