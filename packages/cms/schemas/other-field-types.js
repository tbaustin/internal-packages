import { aspectRatio as aspectRatioValidation } from '../validation'


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
