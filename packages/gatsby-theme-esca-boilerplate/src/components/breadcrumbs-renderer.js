import React from 'react'
import { css } from '@emotion/core'
import { Breadcrumbs } from '@escaladesports/components'
import { FaAngleRight } from 'react-icons/fa'
import { useTemplateEngine } from '../context/template-engine'
import Container from './container'
import { colors, sizes } from '../styles/variables'



const getLinkedCategoryCrumbs = (crumb, templateEngine) => {
	const categorySettings = crumb?.category

	const {
		dataSource,
		insertParentCategories,
		disableLastLink,
	} = categorySettings || {}

	const {
		category,
		templateVariable,
		useTemplateDataSource,
	} = dataSource || {}

	const linkedCategory = useTemplateDataSource ? templateEngine.data
		: templateVariable ? templateEngine.resolveProperty(templateVariable)
			: category

	if (!linkedCategory) return null

	const allLinkedCategories = insertParentCategories
		? linkedCategory?.ancestry
		: [ linkedCategory ]

	return allLinkedCategories?.map((c, idx) => {
		const text = templateEngine.data && crumb?.title
			? templateEngine.parse(crumb.title, c)
			: c?.name || `Category`

		const href = templateEngine.data && crumb?.path
			? templateEngine.parse(crumb.path, c)
			: `/${c?.slug?.current || ``}`

		const isLast = idx === allLinkedCategories.length - 1
		const disableLink = isLast && disableLastLink

		return { text, ...!disableLink && { href } }
	})
}



export default function BreadcrumbsRenderer(props) {
	const crumbsProp = props.crumbs || []
	const templateEngine = useTemplateEngine()

	let crumbs = []

	for (let crumb of crumbsProp) {
		let categorySettings = crumb?.category
		let categoryCrumbs = getLinkedCategoryCrumbs(crumb, templateEngine)

		if (categoryCrumbs) {
			crumbs.push(...categoryCrumbs)
			continue
		}


		let { title, path } = crumb

		let text = templateEngine?.data
			? templateEngine.parse(title)
			: title

		let href = templateEngine?.data
			? templateEngine.parse(path)
			: path

		crumbs.push({ text, href })
	}

	const separator = (
		<FaAngleRight className="separator" />
	)

	if (!crumbs.length) return null

	return (
		<div css={style}>
			<Container width="constrained" smartPadding align="flex-start">
				<Breadcrumbs crumbs={crumbs} separator={separator} />
			</Container>
		</div>
	)
}


const style = css`
  width: 100%;
	height: ${sizes.breadcrumbsHeight};
	display: flex;
	align-items: center;

  background: ${colors.navMedium};
  color: white;
	
  ul > li {
    font-size: 12px;
    margin-right: 10px;
    .separator {
      color: ${colors.textMedium} !important;
    }
    > span:not(.separator) {
      margin-right: 10px;
      :last-of-type {
        color: ${colors.red};
      }
    }
    > a {
      margin-right: 10px;
      color: ${colors.textMedium} !important;
      text-decoration: none;
    }
  }



`
