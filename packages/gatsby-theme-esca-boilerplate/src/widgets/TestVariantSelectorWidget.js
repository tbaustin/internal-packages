import React from 'react'
import { useCurrentVariant } from '../context/current-variant'
import { useTemplateEngine } from '../context/template-engine'


export default function TestVariantSelectorWidget(props) {
  const [currentSku, setCurrentSku] = useCurrentVariant()
  const templateEngine = useTemplateEngine()

  const { variants = [] } = templateEngine?.data || {}

  const handleClick = sku => () => {
    setCurrentSku(sku)
  }

  return (
    <ul>
      {variants.map((variant, idx) => {
        const text = variant?.name || `TEST VARIANT NAME`
        const isCurrent = variant?.sku === currentSku

        return (
          <li
            key={`variant-${idx}`}
            onClick={handleClick(variant?.sku)}
            style={{ cursor: `pointer` }}
          >
            {isCurrent ? <strong>{text}</strong> : text}
          </li>
        )
      })}
    </ul>
  )
}
