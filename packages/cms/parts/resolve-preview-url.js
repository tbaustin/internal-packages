const domain = process.env.NODE_ENV === `production` ? `https://escalade-website-boilerplate.netlify.app` : `http://localhost:8000`

export default function resolvePreviewUrl(document) {
	return `${domain}/preview/${document._id}`
}