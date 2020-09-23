import makeVariableType from '../../make-variable-type'


export const galleryImageSet = makeVariableType({
  name: `galleryImageSet`,
  title: `Gallery Image Set`,
  mainField: {
    name: `manualImages`,
    title: `Choose images manually`,
    type: `array`,
    of: [{ type: `customFieldImage` }]
  }
})


export const GalleryWidget = {
	title: `Image Gallery`,
	name: `GalleryWidget`,
	type: `object`,
	fields: [
    {
      name: `imageSet`,
      title: `Image Set`,
      type: `galleryImageSet`
    }
	],
  preview: {
    select: {
      imageSet: `imageSet`
    },
    prepare({ imageSet }) {
      const {
        manualImages,
        templateVariable,
        useTemplateDataSource
      } = imageSet

      const subtitleWithCount = manualImages?.length
        ? `${manualImages.length} image(s)`
        : `No images`

      const subtitle = (templateVariable || useTemplateDataSource)
        ? `Images from ${templateVariable || `template data source`}`
        : subtitleWithCount

      return { title: `Image Gallery`, subtitle }
    }
  }
}
