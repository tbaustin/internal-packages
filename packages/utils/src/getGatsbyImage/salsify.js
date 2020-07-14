import { setFileExtension, prepareOptions } from './helpers'
import {
	FIXED_MULTIPLIERS,
	FLUID_MULTIPLIERS,
	LOWEST_FLUID_WIDTH,
} from './constants'



function getSalsifyUrlParts(url) {
	if (!url) return []
	const isTransformParams = str => {
		const isParam = part => !!part.match(/^[a-zA-Z]+_[\w\d]+$/)
		return typeof str === `string` && str.split(`,`).every(isParam)
	}
	return url.split(`/`).filter(part => !isTransformParams(part))
}



export function buildSalsifyImageUrl(baseUrl, options) {
	const { width, maxWidth, height, maxHeight, extension } = options || {}

	const transformParams = {
		w: width || maxWidth,
		h: height || maxHeight,
		q: options?.quality || 60,
		c: options?.cropMode || `fit`,
	}

	const transformString = Object.keys(transformParams || {})
		.map(key => {
			const value = transformParams[key]
			return value ? `${key}_${value}` : null
		})
		.filter(Boolean)
		.join()

	const urlParts = getSalsifyUrlParts(baseUrl)
	const fileName = urlParts.pop()
	urlParts.push(transformString)

	const urlWithTransform = `${urlParts.join(`/`)}/${fileName}`
	const httpsUrl = urlWithTransform.replace(`http://`, `https://`)
	return setFileExtension(httpsUrl, extension)
}



export function getSalsifySrcSet(mode, image, options) {
	const { maxWidth, aspectRatio } = options

	const multipliers = mode === `fixed` ? FIXED_MULTIPLIERS : FLUID_MULTIPLIERS

	const sources = multipliers.map(scale => {
		const width = Math.round(maxWidth * scale)
		let height = aspectRatio ? Math.round(width / aspectRatio) : null

		if (mode === `fluid` && width < LOWEST_FLUID_WIDTH) {
			return null
		}

		// Override width & height on this URL
		const urlBuilderOptions = { ...options, width, height }

		return {
			url: buildSalsifyImageUrl(image, urlBuilderOptions),
			size: mode === `fluid` ? `${width}w` : `${scale}x`,
		}
	})

	return sources.filter(Boolean).map(s => `${s.url} ${s.size}`).join(`,\n`)
}



export default function salsifyGatsbyImage(...args) {
	const [ mode, image ] = args

	const options = prepareOptions(...args)
	const { maxWidth, maxHeight, sizes, aspectRatio } = options

	const webpOptions = { ...options, extension: `webp` }

	const src = buildSalsifyImageUrl(image, options)
	const srcWebp = buildSalsifyImageUrl(image, webpOptions)

	const srcSet = getSalsifySrcSet(mode, image, options)
	const srcSetWebp = getSalsifySrcSet(mode, image, webpOptions)

	const base64 = options?.base64Img
		|| options?.base64
		|| options?.lqip
		|| null

	return {
		base64,
		src,
		srcWebp,
		srcSet,
		srcSetWebp,
		...mode === `fixed` && {
			width: maxWidth,
			height: maxHeight,
		},
		...mode === `fluid` && {
			sizes,
			aspectRatio,
		},
	}
}
