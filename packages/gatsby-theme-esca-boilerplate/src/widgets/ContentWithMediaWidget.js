import React from 'react'
import { css } from '@emotion/core'
import ContentRenderer from './index'
import { getFluidGatsbyImage } from 'gatsby-source-sanity'
import Img from 'gatsby-image'
import ReactPlayer from 'react-player'

import { sanityProjectId, sanityDataset } from 'config'
import { breakpoints, screenWidths, colors } from '../styles/variables'

export default function ContentWithMediaWidget(props){
	const {
		content,
		header,
		mediaFirst,
		video,
		image,
	} = props

	function renderMedia() {
		if(video){
			return (
				<div className="videoContainer">
					<ReactPlayer
						className='react-player'
						url={video?.nonFile?.url}
						controls
						width='100%'
						height='100%'
					/>
				</div>
			)
		} else if(image) {
			const sanityConfig = {
				projectId: sanityProjectId,
				dataset: sanityDataset,
			}

			const fluid = getFluidGatsbyImage(
        image?.asset?._id,
        { maxWidth: 1024 },
        sanityConfig,
			)

			return (
				<Img fluid={fluid} />
			)
		} else {
			return null
		}
	}

	return (
		<section css={styles(mediaFirst)}>
			<div className="media item">
				{renderMedia()}
			</div>
			<div className="mediaContent item">
				<h2 className="header">{header}</h2>
				{content && <ContentRenderer blocks={content} /> }
			</div>
		</section>
	)
}

const styles = (mediaFirst) => css`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0 30px;
  width: 100%;
  max-width: ${screenWidths.desktop};
  margin: 100px auto;
  .header {
    text-transform: uppercase;
    font-size: 36px;
    line-height: 42px;
    margin-bottom: 25px;
    :after {
      height: 3px;
      display: block;
      width: 68px;
      background: ${colors.red};
      content: '';
      margin-top: 15px;
    }
  }
  .media {
    order: ${mediaFirst ? `1`: `2`};
  }
  .mediaContent {
    order: 1;
    font-size: 18px;
    line-height: 28px;
  }
  .item {
    flex: 1 0 100%;
  }
  .videoContainer {
    position: relative;
    padding-top: ${100 / (16 / 9)}%;
    width: 100%;
    background: grey;
    .react-player {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  @media(${breakpoints.tablet}) {
    .item {
      flex: 0 1 calc(50% - 20px);
    }
    .header {
      font-size: 48px;
    }
  }
`
