import React from 'react'
import { css } from '@emotion/core'
import { useTemplateEngine } from '../context/template-engine'
import GalleryWidget from './GalleryWidget'
import Container from '../components/container'
import H1Substitute from '../components/h1-substitute'
import ContentRenderer from './index'
import PriceStockWidget from './PriceStockWidget'
import VariantSelectorWidget from './VariantSelectorWidget'
import AddToCartWidget from './AddToCartWidget'
import ReviewSnippetWidget from './ReviewSnippetWidget'
import WriteReviewWidget from './WriteReviewWidget'
import { colors, breakpoints } from '../styles/variables'


export default function ProductOverviewWidget(props) {
	const {
		sku,
		name,
		useH1,
		brandText,
		shippingInfo,
		variantSelectionMethod,
		trimVariantLabels,
	} = props

	const templateEngine = useTemplateEngine()

	const resolveVal = val => templateEngine.data
		? templateEngine.parse(val)
		: val

	const Heading = useH1 ? `h1` : H1Substitute

	return (
		<Container width="constrained" direction="row" smartPadding>
			<div css={carouselStyle}>
				<GalleryWidget {...props.imageGallery} />
			</div>
			<div css={infoStyle}>
				<div className="skuDisplay">
					<span itemProp="brand">{resolveVal(brandText) || `Lifeline`}</span>
          &nbsp;/&nbsp;
					<span itemProp="sku">{resolveVal(sku)}</span>
				</div>
				<Heading itemProp="name">{resolveVal(name)}</Heading>
				<PriceStockWidget {...props} />
				<ReviewSnippetWidget sku={resolveVal(sku)}/>
				<WriteReviewWidget sku={resolveVal(sku)}/>
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

  .main-image {
    margin-bottom: 20px;
  }
`


const infoStyle = css`
  width: 100%;

  @media(${breakpoints.laptop}) {
    width: 50%;
    padding: 1.5rem;
  }

  h1, .h1-substitute {
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

      &:first-of-type {
        color: ${colors.textMedium}
      }
    }
  }
`
