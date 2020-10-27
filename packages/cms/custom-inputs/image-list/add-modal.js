import React, { useState } from 'react'
import Modal from 'part:@sanity/components/dialogs/default'
import FormField from 'part:@sanity/components/formfields/default'
import TextInput from 'part:@sanity/components/textinputs/default'



export default function AddModal(props) {
  const { isActive, onClose, onAdd } = props

  const [errorMessage, setErrorMessage] = useState(``)
  const [value, setValue] = useState(``)

  const handleChange = event => {
    const { value: eventValue, validity } = event?.target || {}
    setValue(eventValue || ``)

    const isValid = !validity?.typeMismatch
    const newErrorMessage = isValid ? `` : `Please enter a valid URL`
    setErrorMessage(newErrorMessage)
  }

  const handleAction = action => {
    if (action?.key === `add`) {
      if (!value) return setErrorMessage(`URL is required`)
      onAdd?.(value)
    }
    handleClose()
  }

  const handleClose = () => {
    setValue(``)
    setErrorMessage(``)
    onClose?.()
  }

  const modalActions = [
    {
      kind: `default`,
      title: `Add`,
      key: `add`,
      disabled: Boolean(errorMessage)
    },
    {
      kind: `secondary`,
      title: `Cancel`,
      key: `cancel`
    }
  ]

  const modalProps = {
    title: `Add Image`,
    actions: modalActions,
    onAction: handleAction,
    onClose: handleClose
  }

  const formFieldMarkers = [
    {
      type: `validation`,
      level: `error`,
      item: {
        message: errorMessage
      }
    }
  ]

  const formFieldProps = {
    label: `URL of image`,
    labelFor: `add-custom-field-image-url`,
    markers: errorMessage ? formFieldMarkers : []
  }

  return !isActive ? null : (
    <Modal {...modalProps}>
      <FormField {...formFieldProps}>
        <TextInput
          type="url"
          inputId="add-custom-field-image-url"
          value={value}
          onChange={handleChange}
          customValidity={errorMessage}
        />
      </FormField>
    </Modal>
  )
}
