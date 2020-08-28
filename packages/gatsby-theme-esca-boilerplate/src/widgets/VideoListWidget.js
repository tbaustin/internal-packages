import React, { useState, useMemo } from 'react'
import { css } from '@emotion/core'
import ReactPlayer from 'react-player'
import { IoMdCloseCircleOutline } from 'react-icons/io'
import { MdPlayCircleOutline, MdKeyboardArrowRight } from 'react-icons/md'

import { screenWidths, colors, breakpoints } from '../styles/variables'

function getYoutubeId(url){
	return url.split(`/`).pop()
}

function generateUrl(id){
	return `https://youtu.be/${id}`
}

function generateThumbNail(id, position = `0`){
	return `https://img.youtube.com/vi/${id}/${position}.jpg`
}

export default function VideoListWidget(props) {
	const { videoList } = props
	const [active, setActive] = useState(0)
	const [error, setError] = useState(null)
	const [currentVideo, setVideo] = useState(null)
	const [showCats, setCats] = useState(false)

	const activeVideoList = videoList?.[active]?.videos


	return (

		<div css={style}>
			{videoList.length > 1 && (
				<>
					<div
						className="toggle"
						onClick={() => setCats(true)}
					>
        Open Categories
					</div>
					<ul className={`categoryList${showCats ? ` activeCats` : ``}`}>
						{videoList && videoList.map(({ title }, i) => (
							<li
								className={`categoryItem${active === i ? ` active` : ``}`}
								onClick={() => {
									setActive(i)
									setCats(false)
								}}
								key={i}
							>
								<div className="title">
									{title}
								</div>
								<div className="arrow">
									<MdKeyboardArrowRight />
								</div>
							</li>
						))}
					</ul>
				</>
			)}
			<ul className="videoList">
				{activeVideoList && activeVideoList.map(({ title, upload }, i) => {
					const { nonFile } = upload || {}

					const youtubeId = nonFile?.url ? getYoutubeId(nonFile.url) : nonFile.youtubeId
					const thumbNail = generateThumbNail(youtubeId, 0)

					return (
						<li
							className={`videoItem${videoList.length > 1 ? ``: ` fullWidth`}`}
							key={i}
							onClick={() => setVideo(generateUrl(youtubeId))}
						>
							{error
								? <div>{error}</div>
								: (
									<>
										<div className="thumbContainer">
											<div className="play">
												<MdPlayCircleOutline />
											</div>
											<img src={thumbNail} alt="thumbnail-image"/>
										</div>
										<div className="thumbTitle">{title}</div>
									</>
								)
							}
						</li>
					)
				})}
			</ul>
			{currentVideo && (
				<div className="videoModal" onClick={e => {
					const { className } = e?.target || {}
					if(className !== `placeholder`){
						setVideo(null)
					}
				}}>
					<div className="wrapper">
						<div className="placeholder">
							<div className="close" onClick={() => setVideo(null)}>
								<IoMdCloseCircleOutline />
							</div>
							<ReactPlayer
								className='react-player'
								url={currentVideo}
								onError={e => setError({ error: e })}
								controls
							/>
						</div>
					</div>

				</div>
			)}
		</div>
	)
}

const style = css`
  width: 100%;
  max-width: ${screenWidths.desktop};
  margin: 0 auto;
  display: flex;
  flex-flow: row wrap;
  justify-content: flex-start;
  padding: 40px;
  .thumbContainer {
    position: relative;
    .play {
      position: absolute;
      z-index: 2;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      opacity: .5;
      cursor: pointer;
      :hover {
        opacity: 1;
      }
      svg {
        height: 75px;
        width: 75px;
      }
    }
  }
  .toggle {
    flex: 1 0 100%;
    cursor: pointer;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: bolder;
    :hover {
      color: ${colors.red};
    }
    margin-bottom: 30px;
  }
  img {
    width: 100%;
  }
  .videoList {
    flex: 1 0 100%;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    width: inherit;
    .videoItem {
      flex-basis: 100%;
      max-width: 100%;
    }
  }
  .arrow {
    margin-left: auto;
    svg {
      height: 30px;
      width: 30px;
    }
  }
  .categoryList {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    padding: 30px 20px;
    background: white;
    z-index: 200;
    flex: 1 0 100%;
    overflow: auto;
    flex-flow: column nowrap;
    .active {
      color: ${colors.red} !important;
      .arrow {
        border-color: ${colors.red} !important;
      }
    }
    .categoryItem {
      cursor: pointer;
      text-transform: uppercase;
      white-space: nowrap;
      margin-bottom: 30px;
      font-size: 16px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      .title {
        margin-right: 20px;
      }
    }
  }
  .activeCats {
    display: flex;
  }
  .videoList {
    flex: 1;
    .videoItem {
      margin-bottom: 20px;
      .thumbTitle {
        font-size: 22px;
        font-weight: bolder;
        margin: 20px 0;
      }
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .videoModal {
    z-index: 200;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, .4);
    display: flex;
    justify-content: center;
    align-items: center;
    .wrapper {
      position: relative;
      overflow-x: visible;
      overflow-y: auto;
      max-width: 1120px;
      width: 100%;
      margin: 0 auto;
    }
    .placeholder {
      position: relative;
      padding-top: 56.28%;
      background: grey;
    }
    .react-player {
      position: absolute;
			top: 50%;
			left: 0;
      transform: translateY(-50%);
      width: 100% !important;
      height: 100% !important;
      max-height: 80vh !important;
    }
    .close {
      position: absolute;
      z-index: 201;
      top: 10px;
      right: 10px;
      color: white;
      opacity: .5;
      cursor: pointer;
      :hover {
        opacity: 1;
      }
      svg {
        width: 60px;
        height: 60px;
      }
    }
  }

  @media(${breakpoints.tablet}) {
    .videoList {
      display: flex;
      justify-content: flex-start;
      margin: -20px;
      .videoItem, .fullWidth {
        margin: 20px;
      }
      .fullWidth {
        flex-basis: calc(50% - 40px)
      }
    }
    .toggle {
      display: none;
    }
    .categoryList {
      display: block;
      position: static;
      flex: 0;
      margin-right: 20px;
      overflow: visible;
      z-index: 0;
      height: auto;
      width: auto;
    }
    .videoList {
      flex: 1;
    }
    .videoModal {
      .wrapper {
        width: calc(100% - 50px);
      }
    }
  }
  @media(${breakpoints.laptop}) {
    .videoList {
      .videoItem {
        flex-basis: calc(50% - 40px);
      }
      .fullWidth {
        flex-basis: calc((100% / 3) - 40px);
      }
    }
  }
  @media(${breakpoints.desktop}){
    .videoList {
      .videoItem {
        flex-basis: calc((100% / 3) - 40px);
      }
      .fullWidth {
        flex-basis: calc(25% - 40px);
      }
    }
  }
`
