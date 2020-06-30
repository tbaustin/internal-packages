import { getFixedGatsbyImage, getFluidGatsbyImage } from './index'

// salsify
const salsifyUrl = `http://images.salsify.com/image/upload/s--q4bsEzUQ--/qqfmqkexp77wmzirnvrv.jpg`

// sanity
const sanityConfig = {
	projectId: `c3g4r239`,
	dataset: `dev`,
}
const sanityImageId = `image-ae1185e833772f2c39366f69a425d78ae5517965-2000x2000-png`

// other
const otherUrl = `https://via.placeholder.com/1600`


test(`Gatsby functions should return correct object`, () => {
	expect(getFixedGatsbyImage(salsifyUrl, { width: 800 }))
		.toBeInstanceOf(Object)
	expect(getFluidGatsbyImage(salsifyUrl, { maxWidth: 1600 }))
		.toBeInstanceOf(Object)

	expect(getFixedGatsbyImage(sanityImageId, { width: 800 }, sanityConfig))
		.toBeInstanceOf(Object)
	expect(getFluidGatsbyImage(sanityImageId, { maxWidth: 1600 }, sanityConfig))
		.toBeInstanceOf(Object)

	expect(getFixedGatsbyImage(otherUrl, { width: 800 }))
		.toBeInstanceOf(Object)
	expect(getFluidGatsbyImage(otherUrl, { maxWidth: 1600 }))
		.toBeInstanceOf(Object)
})

