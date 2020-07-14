import {
	DEFAULT_FIXED_WIDTH,
	DEFAULT_FLUID_MAX_WIDTH,
} from './constants'


export function setFileExtension(url, extension) {
	if (!extension) return url
	const baseUrl = url.match(/.*\./)[0]
	return `${baseUrl}${extension}`
}


export function prepareOptions(...args) {
	const [ mode, inputUrl, options ] = args

	const defaultWidth = mode === `fixed`
		? DEFAULT_FIXED_WIDTH
		: DEFAULT_FLUID_MAX_WIDTH

	const maxWidth = options?.maxWidth || options?.width || defaultWidth
	const maxHeight = options?.aspectRatio
		? Math.round(maxWidth / options.aspectRatio)
		: options?.maxHeight || options?.height || maxWidth

	const aspectRatio = options?.aspectRatio || maxWidth / maxHeight
	const sizes = `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`

	const isWebP = inputUrl?.endsWith?.(`.webp`)

	const extension = options?.toFormat
    || options?.format
    || options?.extension
    || (isWebP ? `jpg` : null)

	return {
		...options,
		maxWidth,
		maxHeight,
		aspectRatio,
		sizes,
		extension,
	}
}
