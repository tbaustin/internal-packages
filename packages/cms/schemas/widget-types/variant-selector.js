
export const VariantSelectorWidget = {
	title: `Variant Selector`,
	name: `VariantSelectorWidget`,
	type: `object`,
	fields: [
		{
			title: `Enabled`,
			name: `enabled`,
			type: `boolean`,
			hidden: true,
		}
	],
	preview: {
		prepare() {
			return {
				title: `Variant Selector Enabled`
			}
		}
	}
}
