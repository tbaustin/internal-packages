const chalk = require(`chalk`)
const createNetlifyConfig = require(`../create-netlify-config`)


exports.command = `netlify`
exports.describe = `Creates the netlify.toml file in website project`


exports.handler = async () => {
  try {
		console.log(chalk.blueBright(`Creating Netlify config...`))
		await createNetlifyConfig()
		console.log(chalk.blueBright(`Netlify config created!\n`))
	}
	catch(err) {
		console.error(err)
		process.exit(1)
	}
}
