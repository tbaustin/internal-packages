import React, { useState, useEffect } from 'react'
import { getFluidGatsbyImage } from 'gatsby-source-sanity'
import { Link } from 'gatsby'
import { css } from '@emotion/core'
import Img from 'gatsby-image'
import { sizes, shadows } from '../../styles/variables'
import { useLayoutState } from '../../context/layout'
import { sanityProjectId, sanityDataset } from 'config'


const sanityConfig = {
	projectId: sanityProjectId,
	dataset: sanityDataset,
}


export default function StaticNav({ links, closeNav }) {
	const [activeIdx, setActiveIdx] = useState({})
	const [activeNav, setActiveNav] = useState(false)

	useEffect(() => {
		if(closeNav){
			setActiveNav(false)
		}
	}, [closeNav])

	const [ layoutState ] = useLayoutState()

	// useEffect(() => {
	// 	const body = document.querySelector(`body`)
	// 	body.style.overflow = `hidden`
	// }, [activeNav])

	function onLeaveNav(e, sibling) {
		const classList = e?.relatedTarget?.classList
		const didInvolveSibling = classList?.contains?.(sibling)
		if(didInvolveSibling){
			return
		} else  {
			setActiveIdx({})
		}
	}

	function renderLink(link, idx, parent) {
		const { title, subLinks, path, image } = link

		const fluid = image && getFluidGatsbyImage(
			image?.asset?._id,
			{ maxWidth: 500 },
			sanityConfig,
		)

		const parentClass = parent ? ` parent${activeIdx[idx] ? ` active` : ``}`: ``
		const parentActive = parent && activeIdx[idx]

		const multilevel = subLinks?.some(l => l?.subLinks?.length)

		return (
			<li
				key={idx}
				className={`navItem ${(parent && !multilevel) ? `rel` : ``}`}
			>
				<div
					className={`subTitle${parentActive ? ` red` : ``}`}
					onMouseEnter={() => {
						if(parent && subLinks) {
							setActiveIdx({[idx]: true})
						}
					}}
					onMouseLeave={(e) => {
						if(parent && subLinks) {
							onLeaveNav(e, `navItem`)
						}
					}}
				>
					<Link	to={path || `/`}>
						{
							fluid
								? <Img fluid={fluid} imgStyle={{objectFit: `contain`}} />
								: title
						}
					</Link>
					{parent && (
						<div
							className={`arrow`}
							onClick={() => {
								if(subLinks){
									if(activeIdx[idx]){
										setActiveIdx({...activeIdx, [idx]: false})
									} else if(parent && subLinks) {
										setActiveIdx({...activeIdx, [idx]: true })
									}
								}
							}}
						/>
					)}
				</div>
				{subLinks && (
					<ul
						className={`navList${parentClass}${(parent && !multilevel) ? ` vertical` : ``}`}
						onMouseLeave={(e) => {
							if(parent && subLinks) {
								onLeaveNav(e, `navItem`)
							}
						}}
					>
						{subLinks.map((sLink, i) => renderLink(sLink, i))}
					</ul>
				)}
			</li>
		)
	}

	return (
		<nav css={getStyles(layoutState)} className="desktopNav">
			<div className={`navContainer${activeNav ? ` activeNav` : ``}`}>
				<ul className={`mainNav`}>
					{links?.map((link, i) => renderLink(link, i, true))}
				</ul>
			</div>
		</nav>
	)
}

const getStyles = layoutState => {
	const { headerHeight, breadcrumbs } = layoutState
	const dropdownPosition = !!breadcrumbs?.length
		? `calc(${headerHeight} - ${sizes.breadcrumbsHeight})`
		: headerHeight

	return css`
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
		}
		.subTitle a {
			text-decoration: none;
			color: #999;
		}
		.red {
			color: #c8202e !important;
			:hover {
				opacity: 1 !important;
			}
			a {
				color: #c8202e !important;
			}
			.arrow {
				border-color: #c8202e;
			}
		}
		.subTitle {
			:hover {
				opacity: 0.7;
			}
		}
		.arrow {
			border-bottom: 2px solid black;
			border-right: 2px solid black;
			padding: 4px;
			margin-left: 15px;
			transform: rotate(45deg);
			cursor: pointer;
		}
		.navContainer {
			display: block;
			position: static;
			height: auto;
			padding: 0;
			background: transparent;
		}
		.mainNav {
			display: flex;
			justify-content: flex-end;
			align-items: flex-end;
			flex-flow: row nowrap;
			> .navItem {
				flex: 1;
				height: 100%;
				display: flex;
				flex-flow: column nowrap;
				justify-content: center;
				padding-bottom: 15px;
				margin: 0 2px !important;
				&.rel {
					position: relative;
				}
				> .subTitle {
					padding: 4px 20px;
					display: flex;
					align-items: start;
					text-transform: uppercase;
					font-weight: bold;
					color: black;
					a {
						color: black;
					}
					white-space: nowrap;
				}
			}
			.parent {
				flex: 1;
				width: calc(100%);
				background: #fff;
				position: absolute;
				top: ${dropdownPosition};
				left: 0;
				right: 0;
				margin: 0 auto;
				display: none;
				padding: 20px;
				box-shadow: ${shadows.high};
				> .navItem {
					flex: 1;
					margin: 0 20px;
					position: relative;
					> .subTitle {
						font-weight: bold;
						display: block;
						margin-bottom: 40px;
						text-transform: uppercase;
						color: black;
						white-space: nowrap;
						a {
							color: black;
						}
					}
					.navItem {
						margin-bottom: 15px;
					}
				}
			}
			.active {
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
				max-width: ${sizes.constrainWidth};

				&.vertical {
					flex-flow: column wrap;
					top: 100%;
					left: -50px;
					min-width: 270px;
					padding: 20px;
					.subTitle {
						margin: 0;
					}
					.navItem {
						margin-bottom: 30px;
					}
					.gatsby-image-wrapper {
						width: 100%;
						max-height: 100px;
						height: 100px;
						margin-bottom: -30px;
					}
				}
			}
		}
  `
}
