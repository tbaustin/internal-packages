import { getFixedGatsbyImage, getFluidGatsbyImage } from './index'


const testBase64 = Buffer.from(`1234`).toString(`base64`)


test(`Gatsby functions should return correct object`, () => {
	/**
	 * WITH SALSIFY URL - FLUID GATSBY IMAGE
	 */
	const salsifyFluidUrl = `http://images.salsify.com/image/upload/123xyz.jpg`

	const salsifyFluidExpected = {
		base64: testBase64,
		src: `http://images.salsify.com/image/upload/w_800,h_600,q_90,c_fit/123xyz.jpg`,
		srcWebp: `http://images.salsify.com/image/upload/w_800,h_600,q_90,c_fit/123xyz.webp`,
		srcSet: [
			`http://images.salsify.com/image/upload/w_200,h_150,q_90,c_fit/123xyz.jpg 200w`,
			`http://images.salsify.com/image/upload/w_400,h_300,q_90,c_fit/123xyz.jpg 400w`,
			`http://images.salsify.com/image/upload/w_800,h_600,q_90,c_fit/123xyz.jpg 800w`,
			`http://images.salsify.com/image/upload/w_1200,h_900,q_90,c_fit/123xyz.jpg 1200w`,
			`http://images.salsify.com/image/upload/w_1600,h_1200,q_90,c_fit/123xyz.jpg 1600w`,
			`http://images.salsify.com/image/upload/w_2400,h_1800,q_90,c_fit/123xyz.jpg 2400w`,
		].join(`,\n`),
		srcSetWebp: [
			`http://images.salsify.com/image/upload/w_200,h_150,q_90,c_fit/123xyz.webp 200w`,
			`http://images.salsify.com/image/upload/w_400,h_300,q_90,c_fit/123xyz.webp 400w`,
			`http://images.salsify.com/image/upload/w_800,h_600,q_90,c_fit/123xyz.webp 800w`,
			`http://images.salsify.com/image/upload/w_1200,h_900,q_90,c_fit/123xyz.webp 1200w`,
			`http://images.salsify.com/image/upload/w_1600,h_1200,q_90,c_fit/123xyz.webp 1600w`,
			`http://images.salsify.com/image/upload/w_2400,h_1800,q_90,c_fit/123xyz.webp 2400w`,
		].join(`,\n`),
		sizes: `(max-width: 800px) 100vw, 800px`,
		aspectRatio: 4 / 3,
	}

	const salsifyFluidResult = getFluidGatsbyImage(
		salsifyFluidUrl,
		{ maxWidth: 800, maxHeight: 600, quality: 90, base64: testBase64 },
	)

	expect(salsifyFluidResult).toMatchObject(salsifyFluidExpected)


	/**
	 * WITH SALSIFY URL - FIXED GATSBY IMAGE
	 */
	const salsifyFixedUrl = `http://images.salsify.com/image/upload/w_4000,h_3000/123xyz.jpg`

	const salsifyFixedExpected = {
		base64: null,
		src: `http://images.salsify.com/image/upload/w_800,h_800,q_60,c_fit/123xyz.jpg`,
		srcWebp: `http://images.salsify.com/image/upload/w_800,h_800,q_60,c_fit/123xyz.webp`,
		srcSet: [
			`http://images.salsify.com/image/upload/w_800,h_800,q_60,c_fit/123xyz.jpg 1x`,
			`http://images.salsify.com/image/upload/w_1200,h_1200,q_60,c_fit/123xyz.jpg 1.5x`,
			`http://images.salsify.com/image/upload/w_1600,h_1600,q_60,c_fit/123xyz.jpg 2x`,
			`http://images.salsify.com/image/upload/w_2400,h_2400,q_60,c_fit/123xyz.jpg 3x`,
		].join(`,\n`),
		srcSetWebp: [
			`http://images.salsify.com/image/upload/w_800,h_800,q_60,c_fit/123xyz.webp 1x`,
			`http://images.salsify.com/image/upload/w_1200,h_1200,q_60,c_fit/123xyz.webp 1.5x`,
			`http://images.salsify.com/image/upload/w_1600,h_1600,q_60,c_fit/123xyz.webp 2x`,
			`http://images.salsify.com/image/upload/w_2400,h_2400,q_60,c_fit/123xyz.webp 3x`,
		].join(`,\n`),
		width: 800,
		height: 800,
	}

	const salsifyFixedResult = getFixedGatsbyImage(
		salsifyFixedUrl,
		{ width: 800 },
	)

	expect(salsifyFixedResult).toMatchObject(salsifyFixedExpected)


	/**
	 * WITH SANITY IMAGE ID
	 */
	const sanityImageId = `image-123xyz-1600x1200-png`

	const sanityConfig = {
		projectId: `abc123`,
		dataset: `dev`,
	}

	const sanityFixedResult = getFixedGatsbyImage(
		sanityImageId,
		{ width: 800 },
		sanityConfig,
	)

	const sanityFluidResult = getFluidGatsbyImage(
		sanityImageId,
		{ maxWidth: 800 },
		sanityConfig,
	)

	expect(sanityFixedResult).toBeInstanceOf(Object)
	expect(sanityFluidResult).toBeInstanceOf(Object)


	/**
	 * WITH GENERIC (NON-SALSIFY) URL
	 */
	const genericUrl = `https://via.placeholder.com/1600`

	const genericExpectedFluid = {
		base64: null,
		src: `https://via.placeholder.com/1600`,
		srcSet: `https://via.placeholder.com/1600 1200w`,
		sizes: `(max-width: 1200px) 100vw, 1200px`,
		aspectRatio: 1,
	}

	const genericExpectedFixed = {
		base64: null,
		src: `https://via.placeholder.com/1600`,
		srcSet: `https://via.placeholder.com/1600 1x`,
		width: 1200,
		height: 1200,
	}

	expect(getFixedGatsbyImage(genericUrl, { width: 1200 }))
		.toMatchObject(genericExpectedFixed)

	expect(getFluidGatsbyImage(genericUrl, { width: 1200 }))
		.toMatchObject(genericExpectedFluid)
})
