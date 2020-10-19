import { css } from '@emotion/core'
import { runningSection, variables } from '../../styles'

const { breakpoints, colors, screenWidths, sizes } = variables


export default css`
  ${runningSection}
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.navMedium};

  a {
    text-decoration: none;
  }

  section.top {
    width: 100%;
    padding: 4rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .info {
    max-width: 500px;
    margin-bottom: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;

    text-align: center;
    line-height: 1.5;
    color: ${colors.textLight};

    img {
      width: 100%;
      max-width: 320px;
    }
  }

  .nav {
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    .link-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 2rem;

      .title {
        text-transform: uppercase;
        font-size: 20px;
        display: block;
        margin-bottom: 1.5rem;
        font-weight: bolder;
        color: ${colors.textLight};
        white-space: nowrap;
      }

      a {
        margin-bottom: 1rem;
        color: ${colors.textMedium};
        white-space: nowrap;
      }
    }
  }

  .social {
    width: 100%;
    max-width: 300px;
    display: flex;
    justify-content: space-between;

    svg {
      height: 2rem;
      width: 2rem;
      color: ${colors.textMedium};
    }
  }

  section.bottom {
    width: 100%;
    padding: 2rem 3rem;
    display: flex;
    justify-content: center;
    background: ${colors.navDark};
    border-top: 1px solid ${colors.textMedium};
  }

  .bottom-content {
    width: 100%;
    color: ${colors.textMedium};
    text-align: center;
  }

  @media(${breakpoints.tablet}) {
    .nav .link-group {
      width: unset;
    }
  }

  @media(${breakpoints.laptop}) {
    section.top {
      max-width: ${sizes.constrainWidth};
      flex-direction: row;
      flex-wrap: wrap;
      align-items: flex-start;
      padding: 5rem 3rem;
    }

    .info {
      align-items: flex-start;
      text-align: left;
    }

    .nav {
      width: unset;
      flex-grow: 1;

      .link-group {
        align-items: flex-start;
      }
    }

    .social {
      max-width: unset;
      justify-content: flex-end;

      a {
        margin-left: 1.5rem;
      }

      svg {
        width: 1.5rem;
        height: 1.5rem;
      }
    }

    .bottom-content {
      max-width: ${sizes.constrainWidth};
      padding: 0 3rem;
      text-align: left;
    }
  }
`
