/* eslint-disable no-empty */
const { join } = require(`path`)
const fetch = require(`isomorphic-fetch`)
const chalk = require(`chalk`)
const { readFile, outputFile } = require(`fs-extra`)
const dirs = require(`./../../dirs`)
const homeDir = require(`os`).homedir()
const { siteId } = require(`${dirs.site}/config`)



const configPaths = [
	join(homeDir, `.config/netlify`),
	join(homeDir, `.netlify/config`),
	join(homeDir, `.netlify/config.json`),
]



const fetchToken = async () => {
	try {
		const results = await Promise.all(
			configPaths.map(async (path) => {
				try {
					let result = await readFile(path, `utf8`)
					return JSON.parse(result || `{}`)
				}
				catch(err) {
					return {}
				}
			})
		)

		const tokens = results.map(res => {
			const { access_token, userId, users } = res

			if (userId && users) {
				let userObj = users[userId] || {}
				let auth = userObj.auth || {}
				return auth.token
			}

			return access_token
		})

		return tokens.find(Boolean)
	}
	catch(err) {
		console.error(`Can't find key\nPlease install and login with Netlify CLI`)
		console.error(err)
		return null
	}
}



const fetchEnv = async (token, id) => {
	const url = [
		`https://api.netlify.com`,
		`/api/v1/sites/${id}.netlify.com`,
		`?access_token=${token}`
	].join(``)

	try {
		const contents = await fetch(url)
		const data = await contents.json()
		return data.build_settings.env
	}
	catch(err) {
		console.error(`Can't fetch environment from Netlify`)
		return null
	}
}



const writeDotenv = (env = {}) => {
	const contents = Object.keys(env).reduce((acc, key) => {
		const val = (env[key] || ``).replace(/"/g, `\\"`)
		return `${acc}\n${key} = "${val}"`
	}, ``)

	return outputFile(`${dirs.site}/.env`, contents)
}



exports.command = `env`
exports.describe = `Copies Netlify environment variables to local .env file`


exports.handler = async () => {
  console.log(
		chalk.blueBright(`Copying environment variables from Netlify...`)
	)

	if (!siteId) {
		console.error(`No site ID found.`)
		return
	}

	try {
	 	const token = await fetchToken()
		const env = await fetchEnv(token, siteId)
		await writeDotenv(env)
		console.log(
			chalk.blueBright(`Environment variables copied!\n`)
		)
	}
	catch(err) {
		console.error(`Unable to copy environment variables from Netlify`)
		console.error(err)
	}
}
