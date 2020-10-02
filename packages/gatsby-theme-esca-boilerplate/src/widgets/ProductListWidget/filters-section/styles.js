import { css } from '@emotion/core'
import { colors, breakpoints, screenWidths } from '../../../styles/variables'


export default function getStyles(isMobile) {
  const mobileDisplay = isMobile ? `flex` : `none`
  const desktopDisplay = isMobile ? `none` : `flex`

  return css`
    width: 100%;
    max-width: ${screenWidths.tablet};
    padding: 1rem;
    display: ${mobileDisplay};

    @media(${breakpoints.laptop}) {
      width: 16rem;
      display: ${desktopDisplay};
      padding: 1rem 1rem 1rem 0;
    }

    .filterHeading {
      color: ${colors.textDark};
      font-weight: bold;
    }

    .activeFilters {
  		margin-bottom: 20px;
      border-bottom: 1px solid ${colors.lightGrey};
      padding-bottom: 10px;
  	}

  	.activeList {
  		margin-bottom: 20px;
  	}

  	.activeFiltersTitle {
  		font-size: 24px;
      margin-bottom: 10px;
  	}

  	.filter {
  		margin-bottom: 20px;
  		padding-bottom: 10px;
  		border-bottom: 1px solid ${colors.lightGrey};
  	}
  `
}
