import { getFluidGatsbyImage } from 'gatsby-source-sanity'
import { sanityProjectId, sanityDataset } from 'config'
import { useTemplateEngine } from '../../context/template-engine'


const sanityConfig = {
	projectId: sanityProjectId,
	dataset: sanityDataset,
}


export default function useVariableImage(imageFieldValue) {
	const { templateVariable, asset, ...rest } = imageFieldValue || {}

	// Try to replace template variable w/ value in case one is provided
	const engine = useTemplateEngine()
	const variableValue = engine.resolveProperty(templateVariable)

	// Use asset ID derived from template variable or the "hard-coded" one
	const assetId = asset?._id
		|| asset?._ref
		|| variableValue?.asset?._id
		|| variableValue?.asset?._ref

	// Get the Gatsby Image props for the asset ID being used
	const fluid = getFluidGatsbyImage(
		assetId,
		{ maxWidth: 2000 },
		sanityConfig,
	)

	return { fluid, ...rest }
}
