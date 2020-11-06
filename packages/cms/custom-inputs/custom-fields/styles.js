import { css } from '@emotion/core'


export const container = css`
	> * {
		margin-bottom: 2rem;
	}
`

export const input = css`
	input {
		font-size: 0.9rem;
	}
`

export const fieldset = css`
  font-size: 0.9rem;
`

export const fieldLabel = css`
  font-weight: bolder;
  border-bottom: 1px solid rgba(23, 23, 23, 0.1);
`

export const fieldValue = css`
  max-height: 5rem;
  overflow-y: auto; /* Show scrollbar for longer content */
  margin-bottom: 1.5rem;
`

export const legend = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;

  em {
    font-size: 0.7rem;
  }
`

export const attributeIcon = css`
  color: #156dff;
`
