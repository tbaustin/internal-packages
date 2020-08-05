import { css } from '@emotion/core'
import { runningSection, variables } from '../../styles'

const { sizes, colors, shadows, breakpoints } = variables


export default function getStyles(layoutState) {
	const { headerHeight, headerHeightMobile, breadcrumbs } = layoutState

	return css`
	  ${runningSection}
	  align-items: center;
	  position: fixed;
	  z-index: 100;
	  height: ${headerHeightMobile};
		box-shadow: ${shadows.low};
		flex-flow: row wrap;
		background: ${colors.navDark};

		@media(${breakpoints.laptop}) {
			height: ${headerHeight};
		}

		.navAreaContainer {
			justify-content: space-between;
			align-items: stretch;
			flex-wrap: nowrap;
			height: ${sizes.navHeight};
		}

		.navAreaItems {
			display: flex;
			align-items: center;
		}

		.logo {
			height: 100%;
			display: flex;
			align-items: center;

			img {
				@media(${breakpoints.tablet}) {
					height: calc(${sizes.navHeight} - 2rem);
				}

				height: calc(${sizes.navHeight} - 3rem);
			}
		}

		@media(${breakpoints.laptop}) {
			background: ${colors.navLight};
			height: ${headerHeight};

			.navAreaItems {
				align-items: flex-end;
			}
		}
	`
}
