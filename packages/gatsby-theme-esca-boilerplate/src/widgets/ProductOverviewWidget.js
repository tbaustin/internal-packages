import React from 'react'
import { css } from '@emotion/core'
import { useTemplateEngine } from '../context/template-engine'
import CarouselWidget from './CarouselWidget'
import Container from '../components/container'
import ContentRenderer from './index'
import PriceStockWidget from './PriceStockWidget'
import VariantSelectorWidget from './VariantSelectorWidget'
import AddToCartWidget from './AddToCartWidget'
import { colors, breakpoints } from '../styles/variables'


export default function ProductOverviewWidget(props) {
  const {
    sku,
    name,
    brandText,
    shippingInfo,
    variantSelectionMethod,
    trimVariantLabels
  } = props

  const templateEngine = useTemplateEngine()

  const resolveVal = val => templateEngine.data
    ? templateEngine.parse(val)
    : val

  return (
    <Container width="constrained" direction="row" smartPadding>
      <div css={carouselStyle}>
        <CarouselWidget {...props.carousel} />
      </div>
      <div css={infoStyle}>
        <div className="skuDisplay">
          <span>
            {resolveVal(brandText) || `Lifeline`}
            &nbsp;/&nbsp;
          </span>
          <span>{resolveVal(sku)}</span>
        </div>
        <h1>{resolveVal(name)}</h1>
        <PriceStockWidget {...props} />
        <hr />
        {shippingInfo && (
          <>
            <ContentRenderer blocks={shippingInfo} />
            <hr />
          </>
        )}
        {variantSelectionMethod && (
          <VariantSelectorWidget
            method={variantSelectionMethod}
            trimLabels={trimVariantLabels}
          />
        )}
        <AddToCartWidget {...props} />
      </div>
    </Container>
  )
}


const carouselStyle = css`
  width: 100%;

  @media(${breakpoints.laptop}) {
    width: 50%;
    padding-right: 1.5rem;
  }
`


const infoStyle = css`
  width: 100%;

  @media(${breakpoints.laptop}) {
    width: 50%;
    padding: 1.5rem;
  }

  h1 {
    font-size: 2.25rem;
    margin: 0;
  }

  hr {
    border-top: 1px solid ${colors.lightGrey};
    border-bottom: none;
    margin: 1.75rem 0;
  }

  a {
    color: ${colors.textDark} !important;
    text-decoration: underline !important;
  }

  .skuDisplay {
    > span {
      text-transform: uppercase;
      font-size: 0.8rem;
      font-weight: bold;

      &:first-child {
        color: ${colors.textMedium}
      }
    }
  }
`