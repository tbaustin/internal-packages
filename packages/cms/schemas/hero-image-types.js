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
      title: `Heading`,
      name: `heading`,
      type: `string`
    },
    {
      title: `Use <h1> tag for heading`,
      description: `For SEO purposes; if unchecked, the heading will display as`
        + ` a <span> tag with the same appearance as <h1>`,
      name: `useH1`,
      type: `boolean`
    },
    {
      title: `Sub Heading`,
      name: `subHeading`,
      type: `string`
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
      heading: `heading`,
      subHeading: `subHeading`
		},
    prepare(selection) {
      const { image, imageFileName, link, heading, subHeading } = selection
      const { asset, templateVariable } = image || {}

      const title = heading || (
        templateVariable ? `Hero Image (${templateVariable})` : imageFileName
      )
      const subtitle = subHeading || link

      return {
        media: image,
        title,
        subtitle
      }
    }
	}
}
