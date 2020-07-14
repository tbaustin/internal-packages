import salsifyGatsbyImage, { buildSalsifyImageUrl } from './salsify'
import { prepareOptions } from './helpers'
import {
	getFluidGatsbyImage as sanityFluid,
	getFixedGatsbyImage as sanityFixed,
} from 'gatsby-source-sanity'


export { buildSalsifyImageUrl }


function genericGatsbyImage(...args) {
	const [ mode, image ] = args
	const options = prepareOptions(...args)
	const { maxWidth, maxHeight, sizes, aspectRatio } = options

	const srcSet = mode === `fluid`
		? `${image} ${maxWidth}w`
		: `${image} 1x`

	return {
		base64: null,
		src: image,
		srcSet,
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


function getGatsbyImage(...args) {
	const [ mode, image, options, sanityConfig ] = args

	if (!image) return null

	if (!image.includes?.(`http`)) {
		const sanityFunction = mode === `fixed` ? sanityFixed : sanityFluid
		return sanityFunction(image, options, sanityConfig)
	}

	if (!image.includes?.(`salsify`)) {
		return genericGatsbyImage(...args)
	}

	return salsifyGatsbyImage(...args)
}


export function getFixedGatsbyImage(...args) {
	return getGatsbyImage(`fixed`, ...args)
}

export function getFluidGatsbyImage(...args) {
	return getGatsbyImage(`fluid`, ...args)
}
