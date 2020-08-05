import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { useTemplateEngine } from '../context/template-engine'
import { css } from '@emotion/core'

export default function VideoWidget(props) {
	const { upload, specs, templateVariable = `` } = props

	// Video upload set directly on the video widget
	const { nonFile, file } = upload || {}

	// Get template variable value
	const templateEngine = useTemplateEngine()
	const templateValue = templateEngine.resolveProperty(templateVariable)

	/**
	 * Use either the video upload set directly on the VideoWidget or one derived
	 * from the template variable value
	 */
	const video = nonFile?.url
		|| nonFile?.youtubeId
		|| file?.asset?.url
		|| templateValue?.nonFile?.url
		|| templateValue?.nonFile?.youtubeId
		|| templateValue?.file?.asset?.url

	const {
		maxWidth = 1000,
		aspectRatio: {
			height = 1080,
			width = 1920,
		} = {},
	} = specs || {}

	const [error, setError] = useState(null)

	const styles = css`
		position: relative;
  	padding-top: ${100 / (width / height)}%;
		width: 100%;
		max-width: ${maxWidth}px;
		background: grey;
		margin: 0 auto;
		.react-player {
			position: absolute;
			top: 0;
			left: 0;
		}
	`
	return (
		<>
			{error
				? <div>Something went wrong with the video: {error}</div>
				: <div css={styles}>
					<ReactPlayer
						className='react-player'
						url={video}
						onError={e => setError({ error: e })}
						controls
						width='100%'
						height='100%'
					/>
				</div>}
		</>
	)
}
