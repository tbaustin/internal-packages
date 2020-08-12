const child_process = require(`child_process`)
const path = require(`path`)
const { notify, copyTempCms } = require(`./../utils`)
const dirs = require(`./../../dirs`)
const createNetlifyConfig = require(`../create-netlify-config`)
const createSanityConfig = require(`../create-sanity-config`)


exports.command = `dev`
exports.describe = `Runs entire stack in development mode`


exports.handler = async () => {
  /**
   * Regenerate Netlify & Sanity configs
   */
  try {
    notify(`Regenerating configs for Netlify and Sanity...`)
    await createNetlifyConfig()
    await createSanityConfig()
    notify(`Configs rewritten!\n`)

    notify(`Making temp copy of CMS directory...`)
    await copyTempCms()
    notify(`Copy made!\n`)
  }
  catch(err) {
		console.error(err)
		process.exit(1)
	}

  // Run `gatsby clean`
  child_process.spawnSync(`gatsby`, [`clean`], {
    cwd: dirs.site,
    stdio: `inherit`
  })

  /**
   * Start Sanity Studio dev server
   */
  child_process.spawn(`sanity`, [`start`], {
    cwd: dirs.tempCms,
    stdio: `inherit`
  })

  /**
   * Start dev server for Netlify functions
   */
  const configPathAbs = `${dirs.cli}/webpack.functions.js`
  const configPathRel = path.relative(dirs.site, configPathAbs)
  child_process.spawn(
    `netlify-lambda`,
    [
      `serve`,
      `--babelrc`, `false`,
      `--config`, configPathRel,
      `netlify-functions`
    ],
    {
      cwd: dirs.site,
      stdio: `inherit`
    }
  )

  /**
   * Build & start dev server for Gatsby
   */
  child_process.spawn(`gatsby`, [`develop`], {
    cwd: dirs.site,
    stdio: `inherit`
  })
}
