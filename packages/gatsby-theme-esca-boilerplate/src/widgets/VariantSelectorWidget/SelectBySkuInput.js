import React from 'react'
import produce from 'immer'
import { trimCommon } from '@escaladesports/utils'
import Select from '../../components/select'


export default function SelectBySkuInput(props) {
  const { variants, trimLabels, ...other } = props

  const options = variants.map(v => ({
    label: v?.name,
    value: v?.sku
  }))

  const trimmedOptions = produce(options, draft => {
    if (trimLabels) trimCommon(draft, `label`)
  })

  return (
    <Select
      options={trimmedOptions}
      label="Select a Variation"
      {...other}
    />
  )
}
