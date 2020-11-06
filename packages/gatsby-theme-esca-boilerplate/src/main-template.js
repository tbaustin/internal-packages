import React from 'react'
import { graphql } from 'gatsby'
import TemplateEngineProvider from './context/template-engine'
import CurrentVariantProvider from './context/current-variant'
import ProductListsProvider from './context/product-lists'
import useTagManagerEvent from './tag-manager-event'
import Layout from './layout'
import SEO from './components/seo'
import ContentRenderer from './widgets'
import BreadcrumbsRenderer from './components/breadcrumbs-renderer'

/**
 * This is the ONE TEMPLATE TO RULE THEM ALL
 * Used to render ANY page that is defined in the CMS or derived from a template
 * that is defined in the CMS
 */
export default function MainTemplate(props) {
	useTagManagerEvent(props)

	const { pageContext, data: graphqlData } = props
	const {
		content,
		title,
		breadcrumbs,
		dataSource,
    productLists,
    schemaOrgPageType
	} = pageContext || {}

  const allProducts = graphqlData?.allBaseProduct?.nodes || []

  const schemaOrgProps = {
    itemScope: true,
    itemType: schemaOrgPageType,
  }

	return (
		<CurrentVariantProvider>
			<TemplateEngineProvider data={dataSource}>
				<ProductListsProvider lists={productLists} products={allProducts}>
					<Layout breadcrumbs={breadcrumbs} {...schemaOrgProps}>
						<SEO title={title} />
						<ContentRenderer
							className="page-content"
							blocks={content}
						/>
					</Layout>
				</ProductListsProvider>
			</TemplateEngineProvider>
		</CurrentVariantProvider>
	)
}

export const query = graphql`
	query MainTemplateQuery($allProductIds: [String]) {
		allBaseProduct(
			filter: { sku: { in: $allProductIds } }
		) {
			nodes {
				_id
				_type
				sku
				slug {
					current
				}
				salsify
				customFieldEntries
				template {
					_id
					title
					path
				}
				variants {
					_id
					_type
					sku
					price
					rating
					stock
					salsify
					customFieldEntries
					listImageCustomField {
						_id
						name
					}
				}
			}
		}
    sanityTemplate {
      schemaOrgPageType
    }
	}
`
