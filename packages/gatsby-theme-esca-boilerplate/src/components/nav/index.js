import React from 'react'
import { css } from '@emotion/core'

import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'
import InfiniteNav from './InfiniteNav'

import { breakpoints } from '../../styles/variables'

export default function Navigation({ links, closeNav }) { 
	const  infinite = false
	return infinite 
		? <InfiniteNav links={links} /> 
		: 
		<div css={styles}>
			<MobileNav closeNav={closeNav} links={links} />
			<DesktopNav closeNav={closeNav} links={links} />
		</div>
}


const styles = css`
	.desktopNav {
		display: none;
	}
	@media(${breakpoints.laptop}) {
		.desktopNav {
			display: block;
		}
		.mobileNav {
			display: none;
		}
	}
`