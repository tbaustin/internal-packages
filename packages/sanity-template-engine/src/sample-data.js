
export default {
	_type: `movie`,
	title: `The Matrix`,
	rating: 0,
	info: {
		_type: `miscInfo`,
		synopsis: (
			`A computer hacker learns from mysterious rebels about the true ` +
      `nature of his reality and his role in the war against its controllers.`
		),
		year: 1999,
		tags: [`Action`, `Sci-Fi`, `Cyberpunk`],
	},
	directors: [
		{
			name: {
				first: `Lana`,
				last: `Wachowski`,
			},
		},
		{
			name: {
				first: `Lilly`,
				last: `Wachowski`,
			},
		},
	],
	cast: [
		{
			actor: {
				name: {
					first: `Keanu`,
					last: `Reeves`,
				},
			},
			role: `Neo`,
		},
		{
			actor: {
				name: {
					first: `Laurence`,
					last: `Fishburne`,
				},
			},
			role: `Morpheus`,
		},
		{
			actor: {
				name: {
					first: `Carrie-Anne`,
					last: `Moss`,
				},
			},
			role: `Trinity`,
		},
	],
}
