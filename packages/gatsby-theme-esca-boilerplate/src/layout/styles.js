import { css } from '@emotion/core'
import { colors, breakpoints } from '../styles/variables'


export default function getStyles(layoutState) {
  const { headerHeight, headerHeightMobile } = layoutState

  return css`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  	.zygoteWrapper {
  		position: relative;
  		z-index: 10000;
  	}
    .page-container {
      flex: 1;
      width: 100%;
      margin-top: ${headerHeightMobile};

      @media(${breakpoints.laptop}) {
        margin-top: ${headerHeight};
      }
    }
    .page-content {
      display: flex;
      flex-direction: column;
      align-items: center;

      background: white;

      a {
        color: ${colors.primary};
      }
  		overflow-x: hidden;
  		box-sizing: border-box;
    }
  `
}
