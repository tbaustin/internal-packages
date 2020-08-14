export default [
	{
		name: `person`,
		title: `Person`,
		type: `document`,
		fields: [
			{
				name: `name`,
				title: `Full Name`,
				type: `object`,
				fields: [
					{ name: `first`, title: `First Name` },
					{ name: `last`, title: `Last Name` },
				],
			},
		],
	},
	{
		name: `miscInfo`,
		title: `Misc Movie Info`,
		type: `object`,
		fields: [
			{
				name: `synopsis`,
				title: `Synopsis`,
				type: `string`,
			},
			{
				name: `year`,
				title: `Release Year`,
				type: `number`,
			},
			{
				name: `tags`,
				title: `Tags`,
				type: `array`,
				of: [
					{ type: `string` },
				],
			},
		],
	},
	{
		name: `castMember`,
		title: `Cast Member`,
		type: `object`,
		fields: [
			{
				name: `actor`,
				title: `Actor`,
				type: `reference`,
				to: [
					{ type: `person` },
				],
			},
			{
				name: `role`,
				title: `Role`,
				type: `string`,
			},
		],
	},
	{
		name: `movie`,
		title: `Movie`,
		type: `document`,
		fields: [
			{
				name: `title`,
				title: `Title`,
				type: `string`,
			},
			{
				name: `rating`,
				title: `Rating`,
				type: `number`,
			},
			{
				name: `info`,
				title: `Other Info`,
				type: `miscInfo`,
			},
			{
				name: `directors`,
				title: `Directors`,
				type: `array`,
				of: [
					{
						type: `reference`,
						to: [
							{ type: `person` },
						],
					},
				],
			},
			{
				name: `cast`,
				title: `Cast`,
				type: `array`,
				of: [
					{ type: `castMember` },
				],
			},
		],
	},
]
