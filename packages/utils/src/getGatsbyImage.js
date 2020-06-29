import { 
	getFluidGatsbyImage as sanityFluid, 
	getFixedGatsbyImage as sanityFixed, 
} from 'gatsby-source-sanity'


export const LOWEST_FLUID_BREAKPOINT_WIDTH = 100
export const DEFAULT_FIXED_WIDTH = 400
export const DEFAULT_FLUID_MAX_WIDTH = 800

const sizeMultipliersFixed = [1, 1.5, 2, 3]
const sizeMultipliersFluid = [0.25, 0.5, 1, 1.5, 2, 3]



function convertToFormat(url, toFormat) {
	const baseUrl = url.match(/.*\./)[0]
	const extension = url.replace(/.*\./, ``) // AARON HALP MEEE  \(00)/
	const isOriginal = extension === toFormat

	if (isOriginal) {
		return url
	} else {
		return `${baseUrl}${toFormat}`
	}
	
}

function buildImageUrl(url, ...args) {
	const parsedArgs = Array.isArray(args[0]) ? args[0] : args
	url = url.split(`/`)
	let name = url.pop()
	url.push(parsedArgs.join(`,`))
	return `${url.join(`/`)}/${name}`
}

// this doesn't transform images, can only find async ways to do so
// which is a no go for the function

// function getBase64Image(image) {
// 	const url = buildImageUrl(image, [`w_20`])
// 	const buff = new Buffer(url)
// 	const base64data = buff.toString(`base64`)
// 	console.log(`BASE: `, base64data)
// 	return base64data
// }

function getBasicImageProps(image, args) {
	// need to get aspect ratio here

	let aspectRatio, width, height
	if (args.width && args.height) {
		// if width and height are passed just use this for the AR
		aspectRatio = args.width / args.height
	} else {
		// we will need to see if the given salsify url passed has 
		// width and height already in the cloudinary transformations
		// if not just set the height to the width
		const cloudImageParts = image.split(`/`)
		const cloudArgs = cloudImageParts[cloudImageParts.length - 2].split(`,`) // this is where cloud arguments are
		if(cloudArgs.length > 1) {
			const cloudWidth = cloudArgs.find(arg => arg.includes(`w_`))
			const cloudHeight = cloudArgs.find(arg => arg.includes(`h_`))

			const foundWidth = cloudWidth.replace(`w_`, ``)
			const foundHeight = cloudHeight.replace(`h_`, ``)

			if(foundWidth && foundHeight){
				width = foundWidth
				height = foundHeight

				aspectRatio = +(width) / +(height)

			} else {
				aspectRatio = 1
			}
			
		} else {
			// just set the aspect ratio to 1 so the height and width are equal
			aspectRatio = 1
		}		
	}

	return {
		aspectRatio,
		width,
		height,
		extension: image.replace(/.*\./, ``),
	}
}

function isWebP(url) {
	const isConverted = url.includes(`.webp`)
	const isOriginal = /[a-f0-9]+-\d+x\d+\.webp/.test(url)
	return isConverted || isOriginal
}

export function getFixedGatsbyImage(image, args, sanityConfig) {
	if(!image.includes(`salsify`) && !image.includes(`http`)){
		return sanityFixed(image, args, sanityConfig)
	} else if(image.includes(`http`) && !image.includes(`salsify`)) {
		console.log(`Non sanity salsify image fixed`)
		const props = getBasicImageProps(image, args)
		const width = args.width || DEFAULT_FIXED_WIDTH
		const height = args.height

		let desiredAspectRatio = props.aspectRatio
		// If we're cropping, calculate the specified aspect ratio
		if (height) {
			desiredAspectRatio = width / height 
		}

		const outputHeight = Math.round(height ? height : width / desiredAspectRatio)

		return {
			base64: args.base64Img || null,
			width: Math.round(width),
			height: outputHeight,
			src: image,
			srcSet: `${image} 1x`,
		}
	} else {
		const props = getBasicImageProps(image, args)

		const width = args.width || DEFAULT_FIXED_WIDTH
		const height = args.height

		let desiredAspectRatio = props.aspectRatio

		// If we're cropping, calculate the specified aspect ratio
		if (height) {
			desiredAspectRatio = width / height 
		}

		let forceConvert
		if (args.toFormat) {
			forceConvert = args.toFormat
		} else if (isWebP(image)) {
			forceConvert = `jpg`
		}

		const outputHeight = Math.round(height ? height : width / desiredAspectRatio)

		const imgUrl = buildImageUrl(image, [`w_${width}`, `h_${outputHeight}`])
		
		const widths = sizeMultipliersFixed.map(scale => Math.round(width * scale))
		const initial = {webp: [], base: []}

		const srcSets = widths
			.filter(currentWidth => {
				// going to have to do it this way till we get original image sizes
				if(props.width){
					return currentWidth <= props.width
				} else {
					return true
				}
			})
			.reduce((acc, currentWidth, i) => {
				const resolution = `${sizeMultipliersFixed[i]}x`
				const currentHeight = Math.round(currentWidth / desiredAspectRatio)
				const imgUrl = buildImageUrl(image, [`w_${currentWidth}`, `h_${currentHeight}`])

				const webpUrl = convertToFormat(imgUrl, `webp`)
				const baseUrl = convertToFormat(imgUrl, forceConvert || props.extension)
				acc.webp.push(`${webpUrl} ${resolution}`)
				acc.base.push(`${baseUrl} ${resolution}`)
				return acc
			}, initial)

		const src = convertToFormat(imgUrl, forceConvert || props.extension)
		const srcWebp = convertToFormat(imgUrl, `webp`)

		return {
			base64: args.base64Img || null,
			width: Math.round(width),
			height: outputHeight,
			src,
			srcWebp,
			srcSet: srcSets.base.join(`,\n`) || `${src} 1x`,
			srcSetWebp: srcSets.webp.join(`,\n`) || `${srcWebp} 1x`,
		}
	}
}

export function getFluidGatsbyImage(image, args, sanityConfig) {
	if(!image.includes(`salsify`) && !image.includes(`http`)){
		return sanityFluid(image, args, sanityConfig)
	} else if(image.includes(`http`) && !image.includes(`salsify`)) {
		console.log(`Non sanity salsify image fluid`)
		const props = getBasicImageProps(image, args)
		const maxWidth = Math.min(args.maxWidth || DEFAULT_FLUID_MAX_WIDTH, props.width || DEFAULT_FLUID_MAX_WIDTH)
		const specifiedMaxHeight = args.maxHeight
			? Math.min(args.maxHeight, props.height)
			: undefined
		let desiredAspectRatio = props.aspectRatio
	
		// If we're cropping, calculate the specified aspect ratio
		if (specifiedMaxHeight) {
			desiredAspectRatio = maxWidth / specifiedMaxHeight
		}

		const sizes = args.sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`

		return {
			base64: args.base64Img || null,
			aspectRatio: desiredAspectRatio,
			src: image,
			srcSet: `${image} ${maxWidth}w`,
			sizes,
		}
	} else {
		const props = getBasicImageProps(image, args)

		const maxWidth = Math.min(args.maxWidth || DEFAULT_FLUID_MAX_WIDTH, props.width || DEFAULT_FLUID_MAX_WIDTH)
		const specifiedMaxHeight = args.maxHeight
			? Math.min(args.maxHeight, props.height)
			: undefined
		let desiredAspectRatio = props.aspectRatio
	
		// If we're cropping, calculate the specified aspect ratio
		if (specifiedMaxHeight) {
			desiredAspectRatio = maxWidth / specifiedMaxHeight
		}

		const maxHeight = specifiedMaxHeight || Math.round(maxWidth / desiredAspectRatio)

		let forceConvert
		if (args.toFormat) {
			forceConvert = args.toFormat
		} else if (isWebP(image)) {
			forceConvert = `jpg`
		}

		const baseSrc = buildImageUrl(image, [`w_${maxWidth}`, `h_${maxHeight}`])
		const src = convertToFormat(baseSrc, forceConvert || props.extension)
		const srcWebp = convertToFormat(baseSrc, `webp`)

		const sizes = args.sizes || `(max-width: ${maxWidth}px) 100vw, ${maxWidth}px`
		const widths = sizeMultipliersFluid
			.map((scale) => Math.round(maxWidth * scale))
			.filter((width) => {
			// going to have to do it this way till we get original image sizes
				if(props.width){
					return width < props.width && width > LOWEST_FLUID_BREAKPOINT_WIDTH
				} else {
					return true
				}
			})
		if(props.width) {
			widths.push(props.width)
		}

		const initial = {webp: [], base: []}
		const srcSets = widths
			.filter((currentWidth) => {
			// going to have to do it this way till we get original image sizes
				if(props.width){
					return currentWidth <= props.width
				} else {
					return true
				}
			})
			.reduce((acc, currentWidth) => {
				const currentHeight = Math.round(currentWidth / desiredAspectRatio)
				const imgUrl = buildImageUrl(image, [`w_${currentWidth}`, `h_${currentHeight}`])

				const webpUrl = convertToFormat(imgUrl, `webp`)
				const baseUrl = convertToFormat(imgUrl, forceConvert || props.extension)
				acc.webp.push(`${webpUrl} ${currentWidth}w`)
				acc.base.push(`${baseUrl} ${currentWidth}w`)
				return acc
			}, initial)

		return {
			base64: args.base64Img || null,
			aspectRatio: desiredAspectRatio,
			src,
			srcWebp,
			srcSet: srcSets.base.join(`,\n`),
			srcSetWebp: srcSets.webp.join(`,\n`),
			sizes,
		}
	}
}