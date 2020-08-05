import { css } from '@emotion/core'


export const item = css`
  height: 50px;
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  img {
    cursor: pointer;
  }

  label {
    width: unset;
  }
`


export const altTextDisplay = css`
  color: gray;
  flex: 1;
  margin: 0 1rem;
  cursor: pointer;

  svg {
    font-size: 1.25rem;
  }

  span {
    font-size: 0.8rem;
    font-style: italic;
  }
`


export const modalContent = css`
  width: 50vw;
  min-width: 800px;
  min-height: 600px;
  display: flex;
  align-items: center;
  padding: 2rem;

  img {
    width: 100%;
  }
`
