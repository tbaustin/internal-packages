import React, { useState, useMemo } from 'react'
import { css } from '@emotion/core'

import ContentRenderer from './index'
import Container from '../components/container'

import { screenWidths, colors } from '../styles/variables'

export default function TabBarWidget(props){
	const { tabs } = props
	const [curIdx, setIdx] = useState(0)

	const curTab = useMemo(() => {
		return tabs?.[curIdx]?.container
	}, [tabs, curIdx])


	const { content, ...other} = curTab

	return (
		<section css={styles}>
			<div className="tabBar">
				{tabs && tabs.map(({ title }, i) => (
					<div
						className={`tab${i === curIdx ? ` activeTab`: ``}`}
						key={i}
						onClick={() => setIdx(i)}
					>
						{title}
					</div>
				))}
			</div>
			<div className="tabContent">
				<Container
					component={ContentRenderer}
					blocks={content}
					{...other}
				/>
			</div>
		</section>
	)
}

const styles = css`
	width: 100%;
	max-width: ${screenWidths};
	margin: 50px auto;
	.tabBar {
		display: flex;
		margin: 20px -20px;
		padding: 0 20px;
	}
	.tab {
		margin: 20px;
		text-transform: uppercase;
		font-family: Roboto-Medium,Helvetica,Arial,sans-serif;
		cursor: pointer;
		font-weight: bold;
	}
	.activeTab {
		color: ${colors.red};
	}
`
