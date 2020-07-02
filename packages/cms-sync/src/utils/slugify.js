
export default function(str = ``) {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, `-`)
		.replace(/[^a-z0-9\-_&]+/g, ``)
		.replace(`&`, `and`)
}
