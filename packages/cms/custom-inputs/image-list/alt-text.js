/** @jsx jsx */
import React, { useState, useEffect, forwardRef } from 'react'
import { jsx } from '@emotion/core'
import EditIcon from 'part:@sanity/base/edit-icon'
import PopOver from 'part:@sanity/components/dialogs/popover'
import TextInput from 'part:@sanity/components/textfields/default'
import { altTextDisplay as style } from './styles'


export const AltTextDisplay = forwardRef((props, ref) => {
	const { altText, onClick } = props
	const tooltip = `Alt Text – click to edit`
	const displayText = altText || `(no alt text – click to edit)`

	return (
		<div ref={ref} css={style} onClick={onClick} title={tooltip}>
			<EditIcon />
			&nbsp;
			<span>{displayText}</span>
		</div>
	)
})


const popOverActions = [
  {
    kind: `default`,
    title: `Save`,
    key: `save`
  },
  {
    kind: `secondary`,
    title: `Cancel`,
    key: `cancel`
  }
]


export const AltTextEditor = props => {
  const { isActive, popOverElement, activeItem, onSave, onClose } = props
  const initialValue = activeItem?.altText

  const [inputValue, setInputValue] = useState(``)

	// When opened/closed, refresh the input value to match item being edited
  useEffect(() => {
    if (isActive && initialValue !== inputValue) {
      setInputValue(initialValue)
    }
  }, [isActive])

  const handleInputChange = e => {
    setInputValue(e?.target?.value || ``)
  }

  const handleAction = action => {
    action?.key === `save` && onSave(inputValue)
    action?.key === `cancel` && onClose()
  }

  return !isActive ? null : (
    <PopOver
      referenceElement={popOverElement}
      placement="top"
      onAction={handleAction}
      actions={popOverActions}
      onClickOutside={onClose}
    >
      <TextInput
        label="Change alt text:"
        value={inputValue}
        onChange={handleInputChange}
      />
    </PopOver>
  )
}
