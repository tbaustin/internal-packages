import React, { useState, useEffect } from 'react'
import { Link } from 'gatsby'
import { css } from '@emotion/core'
import { IoIosMenu } from 'react-icons/io'
import { MdClose } from 'react-icons/md'


export default function StaticNav({ links, closeNav }) {
	const [activeIdx, setActiveIdx] = useState({})
	const [activeNav, setActiveNav] = useState(false)

	useEffect(() => {
		if(closeNav){
			setActiveNav(false)
		}
	}, [closeNav])

	// useEffect(() => {
	// 	const body = document.querySelector(`body`)
	// 	body.style.overflow = `hidden`
	// }, [activeNav])

	function renderLink(link, idx, parent) {
		const { title, subLinks, path } = link

		const parentClass = parent ? ` parent${activeIdx[idx] ? ` active` : ``}`: ``
		const parentActive = parent && activeIdx[idx]

		return (
			<li key={idx} className={`navItem`}>
				<div className={`subTitle${parentActive ? ` red` : ``}`}>
					<Link	to={path || `/`}>{title}</Link>
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
					<ul className={`navList${parentClass}`}>
						{subLinks.map((sLink, i) => renderLink(sLink, i))}
					</ul>
				)}
			</li>
		)
	}

	return (
		<nav css={styles.navContainer} className="mobileNav">
			<div className="hamburger" >
				{activeNav
					? <MdClose onClick={() => setActiveNav(!activeNav)} />
					: <IoIosMenu onClick={() => setActiveNav(!activeNav)} />
				}
			</div>
			<div className={`navContainer${activeNav ? ` activeNav` : ``}`}>
				<ul className={`mainNav`}>
					{links?.map((link, i) => renderLink(link, i, true))}
				</ul>
			</div>
		</nav>
	)
}

const styles = {
	navContainer: css`
		margin: 15px;

		.hamburger {
			position: relative;
			z-index: 101;
			cursor: pointer;
			svg {
				height: 40px;
				width: 40px;
				color: #999;
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
		.red {
			color: #c8202e !important;
			a {
				color: #c8202e !important;
			}
			.arrow {
				border-color: #c8202e;
			}
		}
		ul {
			list-style: none;
			padding: 0;
			margin: 0;
		}
		a {
			text-decoration: none;
			color: #333;
		}
		.navContainer {
			position: fixed;
			top: 0;
			left: 0;
      display: none;
			z-index: 100;
			background: white;
			padding-top: 100px;
			height: 100vh;
		}
		.activeNav {
			display: block;
		}
    .mainNav {
			display: flex;
			flex-flow: column nowrap;
			justify-content: flex-start;
			width: 320px;
			overflow: auto;
			height: 100vh;
			padding-bottom: 150px;
			> .navItem {
					> .subTitle {
						padding: 4px 20px;
						display: flex;
						align-items: start;
						text-transform: uppercase;
						font-weight: bold;
						color: black;
						white-space: nowrap;
					}
				}
			.parent {
				display: none;
			}
			.subTitle {
				color: #666;
			}
			.navItem {
				margin: 10px 0;
				flex: 1 0 100%;
			}
			> .navItem {
				flex: 0;
			}
			.navList {
				padding-left: 30px;
				&.parent > .navItem {
					> .subTitle {
						font-weight: bold;
						color: black;
					}
				}
			}
			.active {
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
			}
    }
  `,
}
