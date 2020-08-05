const chalk = require(`chalk`)
const createSanityConfig = require(`../create-sanity-config`)


exports.command = `sanity`
exports.describe = `Creates sanity.json file in CMS folder based on site config`


exports.handler = async () => {
	try {
		console.log(chalk.blueBright(`Creating Sanity config...`))
		await createSanityConfig()
		console.log(chalk.blueBright(`Sanity config created!\n`))
	}
	catch(err) {
		console.error(err)
		process.exit(1)
	}
}
