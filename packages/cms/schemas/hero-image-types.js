import HTMLInput from '../custom-inputs/html-input'
import { aspectRatio as aspectRatioValidation } from '../validation'
import { makeVariableImageType } from '../make-variable-type'


export const heroImageSize = {
  title: `Hero Image Size`,
  name: `heroImageSize`,
  type: `object`,
  fields: [
    {
      title: `Adaptive Height`,
      description: `Height will vary to suit different screen sizes but will `
        + `be overall shorter/taller depending on selection`,
      name: `adaptiveHeight`,
      type: `string`,
      options: {
        list: [`short`, `medium`, `tall`]
      }
    },
    {
      title: `Custom Aspect Ratio`,
      description: `Permanently set an exact aspect ratio; overrides any `
        + `'Adaptive Height' setting chosen`,
      name: `aspectRatio`,
      type: `string`,
      validation: aspectRatioValidation
    },
    {
      title: `Use original image's aspect ratio`,
      description: `Overrides all settings above`,
      name: `useOriginalAspectRatio`,
      type: `boolean`
    }
  ]
}


export const heroImageSource = makeVariableImageType({
  title: `Hero Image Source`,
  name: `heroImageSource`,
  fields: [
		{
			title: `Size/Ratio Options`,
			name: `sizeOptions`,
			type: `heroImageSize`
		}
	]
})


export const heroImage = {
  name: `heroImage`,
  title: `Banner/Hero Image`,
  type: `object`,
  fields: [
    {
      title: `Header`,
      name: `header`,
      type: `string`,
      options: {
        isHighlighted: true,
      },
    },
    {
      title: `Sub Header`,
      name: `subHeader`,
      type: `string`,
      options: {
        isHighlighted: true,
      },
    },
    {
			title: `Link`,
      description: `Makes the hero image into a clickable link`,
			name: `link`,
			type: `string`
		},
    {
			title: `Custom HTML`,
			name: `html`,
			type: `string`,
			inputComponent: HTMLInput
		},
    {
			title: `Image (Mobile)`,
			name: `mobileImage`,
			type: `heroImageSource`,
      validation: Rule => Rule.custom(image => {
        const { asset, templateVariable } = image || {}
        const message = `Please upload an image or choose a field name`
        return Boolean(templateVariable || asset) || message
      })
		},
		{
			title: `Image (Desktop)`,
			description: `If no image is selected, the mobile image will be used.`,
			name: `desktopImage`,
			type: `heroImageSource`
		}
  ],
  preview: {
		select: {
			image: `mobileImage`,
      imageFileName: `mobileImage.asset.originalFilename`,
			link: `link`,
      header: `header`,
      subHeader: `subHeader`
		},
    prepare(selection) {
      const { image, imageFileName, link, header, subHeader } = selection
      const { asset, templateVariable } = image || {}

      const title = header || (
        templateVariable ? `Hero Image (${templateVariable})` : imageFileName
      )
      const subtitle = subHeader || link

      return {
        media: image,
        title,
        subtitle
      }
    }
	}
}
