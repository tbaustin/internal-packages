const { spawn } = require(`child-process-promise`)
const {
	remove,
	pathExists,
} = require(`fs-extra`)
const rename = require(`./rename`)

async function resetGit() {
	if (!await pathExists(`.git`)) {
		return console.log(`No .git directory found`)
	}
	console.log(`Resetting git...`)
	await remove(`.git`)
	await spawn([
		`git init`,
		`git add .`,
		`git commit -m "Initial commit"`,
	].join(` && `), [], {
		shell: true,
		stdio: `inherit`,
	})
}

async function reset(){
	await rename()
	await resetGit()
}

reset()