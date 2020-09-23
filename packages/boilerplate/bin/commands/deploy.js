const child_process = require(`child_process`)
const { notify, warn } = require(`./../utils`)
const dirs = require(`./../../dirs`)

exports.command = `deploy`
exports.describe = `Syncs Salsify products to Sanity and builds the site`


exports.handler = async () => {
	try {
		notify(`Running Sync Process...`)
		child_process.spawnSync(`esca`, [`sync`], {
			cwd: dirs.site,
			stdio: `inherit`,
		})
		notify(`Sync completed!`)
    
		notify(`Running Build Process...`)
		child_process.spawnSync(`esca`, [`build`], {
			cwd: dirs.site,
			stdio: `inherit`,
		})
		notify(`Build completed!`)
	}
	catch(err) {
		warn(`Unable to deploy site. See below.\n`)
		console.error(err)
		warn(`\nExiting...\n`)
		process.exit(1)
	}
}
