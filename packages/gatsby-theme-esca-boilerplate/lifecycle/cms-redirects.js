const { resolve } = require(`path`)
const { readFile, outputFile } = require(`fs-extra`)
const chalk = require(`chalk`)
const redirectsPath = resolve(`./../../public/_redirects`)


/**
 * Regular URL formatting (allow slashes)
 * Also force exactly 1 leading slash (remove any existing)
 */
const cleanRedirectUrl = val => {
	let cleaned = cleanUrl(val, true).replace(/^\/+/, ``)
	return `/${cleaned}`
}

const cleanUrl = (value, allowSlashes) => {
	if (value === null) value = ``
	let result = value
		.replace(/[^a-z0-9/]/gim, ` `)
		.replace(/\s+/g, `-`)
		.replace(/\./g, ``)
		.toLowerCase()
	while (result.indexOf(`--`) > -1) {
		result = result.replace(`--`, `-`)
	}
	if (result.slice(-1) == `-`) {
		result = result.substring(0, result.length - 1)
	}
	if (result.slice(0, 1) == `-`) {
		result = result.substring(1)
	}
	if (!allowSlashes) {
		result = result.replace(/\//g, ``)
	}
	return result
}



exports.onPostBuild = async ({ graphql }) => {
	console.log(chalk.blueBright(`Adding redirects from CMS...`))

	let redirectsString = ``

	try {
		// Keep current contents of _redirects file if it exists
		// Ignore "no such file" error - just keep redirectsString empty
		try {
			redirectsString = await readFile(redirectsPath, `utf8`)
		}
		catch(fsError) {
			if (fsError.code !== `ENOENT`) throw fsError
		}

		const { data } = await graphql(`{
			config: allSanitySiteSettings {
        nodes {
          redirects {
            from
            to
          }
        }
      }
		}`)

		const { redirects } = data.config.nodes[0]
		redirectsString += `\n## From Netlify CMS\n\n`
		redirects.forEach(({ from, to }) => {
			let cleanFrom = cleanRedirectUrl(from)
			let cleanTo = cleanRedirectUrl(to)
			redirectsString += `${cleanFrom} ${cleanTo}\n`
		})

		await outputFile(redirectsPath, redirectsString)
		console.log(chalk.blueBright(`Added redirects from CMS`))
	}
	catch(error) {
		console.log(chalk.red(`Failed to add redirects from CMS`), error)
	}
}
