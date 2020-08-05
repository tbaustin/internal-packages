import React from 'react'
import { css } from '@emotion/core'
import { useTemplateEngine } from '../context/template-engine'
import Container from '../components/container'
import { colors, breakpoints } from '../styles/variables'


export default function ProductDetailsWidget(props) {
  const { description, bullets } = props

  const templateEngine = useTemplateEngine()
  const resolveVal = val => templateEngine.data
    ? templateEngine.parse(val)
    : val

  const displayedBullets = bullets.map(resolveVal).filter(Boolean)

  return (
    <Container width="constrained" smartPadding css={styles}>
      <h2>Product Details</h2>
      <div className="productDescription">
        {resolveVal(description)}
      </div>
      <ul>
        {displayedBullets?.map?.((bullet, idx) => {
          const key = `product-bullet-${idx}`
          return (
            <li key={key}>
              {bullet}
            </li>
          )
        })}
      </ul>
    </Container>
  )
}


const styles = css`
  align-items: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 2rem;

  h2 {
    width: 100%;
    margin-top: 0;
    border-bottom: 1px solid ${colors.lightGrey};
    font-size: 2rem;
  }

  .productDescription {
    width: 100%;
    margin-bottom: 1.5rem;

    @media(${breakpoints.laptop}) {
      width: 60%;
    }
  }

  ul {
    width: 100%;
    padding-left: 3rem;
    margin: 0;

    @media(${breakpoints.laptop}) {
      width: 40%;
    }
  }

  li {
    margin-bottom: 0.75rem;
  }
`
