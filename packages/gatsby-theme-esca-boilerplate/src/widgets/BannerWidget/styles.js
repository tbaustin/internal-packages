import { css } from '@emotion/core'
import { breakpoints, colors } from '../../styles/variables'


const breakpointStyles = {
	mobile: css`
		display: flex;
		@media(${breakpoints.desktop}) {
			display: none;
		}
	`,
	desktop: css`
		display: none;
		@media(${breakpoints.desktop}) {
			display: flex;
		}
	`
}

const adaptiveHeightStyles = {
	short: css`
    height: 75vw;
    max-height: 33vh;
  `,
	medium: css`
    height: 100vw;
    max-height: 50vh;
  `,
	tall: css`
    height: 150vw;
    max-height: 75vh;
  `
}


const calculatePaddingTop = aspectRatio => {
	if (typeof aspectRatio === `number`) return 1 / aspectRatio * 100

	const [ratioWidth, ratioHeight] = aspectRatio?.split?.(`:`) || []
	if (!ratioWidth || !ratioHeight) return 50

	const asDecimal = Number(ratioHeight) / Number(ratioWidth)
	return asDecimal * 100
}


const childElementStyles = css`
  .background-image {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  h1 {
    font-size: 7vw;
  	line-height: 1;
  	color: #fff;
    margin: 0;
  	text-transform: uppercase;
    text-shadow: 4px 3px 16px rgba(0,0,0,0.8);

  	:after {
  		height: 2px;
  		display: block;
  		width: 180px;
  		background: #fff;
  		content: '';
      margin: 0.5em auto;
      box-shadow: 4px 3px 16px 0px rgba(0,0,0,0.8);
  	}

  	@media(${breakpoints.laptop}) {
  		font-size: 4rem;
  	}
  }

  h3 {
    font-size: 3vw;
  	color: #fff;
    margin: 0;
    text-shadow: 4px 3px 16px rgba(0,0,0,0.8);

  	@media(${breakpoints.laptop}) {
      font-size: 1.5rem;
  	}
  }
`


export const htmlStyles = css`
	z-index: 100;
	position: relative;

	button {
		background-color: ${colors.red};
		border: none;
		outline: none;
		color: white;
		text-transform: uppercase;
		font-size: 2.5vw;
		font-weight: bolder;
		padding: 2.5vw 3.5vw;
		cursor: pointer;

		@media(${breakpoints.tablet}) {
			font-size: 16px;
			padding: 25px 40px;
		}
	}
`


export default function getStyles(screenSizeName, imageProps) {
	const { fluid, sizeOptions } = imageProps || {}

	const breakpointStyle = breakpointStyles[screenSizeName || `mobile`]

	const {
		aspectRatio,
		adaptiveHeight,
		useOriginalAspectRatio
	} = sizeOptions || {}

	const appliedAspectRatio = useOriginalAspectRatio
		? fluid?.aspectRatio
		: aspectRatio

	const paddingTopPercent = calculatePaddingTop(appliedAspectRatio || 2)
	const paddingTopCss = css`
		height: 0;
		padding-top: ${paddingTopPercent}%;
	`

	const adaptiveHeightCss = adaptiveHeightStyles[adaptiveHeight || `medium`]

	return css`
		${breakpointStyle}
		width: 100%;
		${appliedAspectRatio ? paddingTopCss : adaptiveHeightCss}
		position: relative;

		${childElementStyles}
	`
}
