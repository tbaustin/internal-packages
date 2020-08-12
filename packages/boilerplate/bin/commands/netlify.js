const { notify, warn } = require(`./../utils`)
const createNetlifyConfig = require(`./../create-netlify-config`)


exports.command = `netlify`
exports.describe = `Creates the netlify.toml file in website project`


exports.handler = async () => {
  try {
		notify(`Creating Netlify config...`)
		await createNetlifyConfig()
		notify(`Netlify config created!\n`)
	}
	catch(err) {
    warn(`Unable to create Netlify config. See below.\n`)
		console.error(err)
    warn(`\nExiting...\n`)
		process.exit(1)
	}
}
