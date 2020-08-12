const child_process = require(`child_process`)
const path = require(`path`)
const { notify, copyTempCms } = require(`./../utils`)
const dirs = require(`./../../dirs`)
const createNetlifyConfig = require(`../create-netlify-config`)
const createSanityConfig = require(`../create-sanity-config`)


exports.command = `build`
exports.describe = `Builds the Gatsby site`


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

  // Run `gatsby build`
  notify(`\nBuilding Gatsby site...\n`)
  const buildProcess = child_process.spawnSync(`gatsby`, [`build`], {
    cwd: dirs.site,
    stdio: `inherit`
  })

  // Build Sanity Studio in public/admin directory
  notify(`\nBuilding Sanity Studio...\n`)
  const studioPathAbs = `${dirs.site}/public/admin`
  const studioPathRel = path.relative(dirs.tempCms, studioPathAbs)
  child_process.spawn(
    `sanity`,
    [`build`, studioPathRel, `-y`],
    {
      cwd: dirs.tempCms,
      stdio: `inherit`
    }
  )

  // Build Netlify functions
  notify(`\nBuilding Netlify functions...\n`)
  const configPathAbs = `${dirs.cli}/webpack.functions.js`
  const configPathRel = path.relative(dirs.site, configPathAbs)
  child_process.spawnSync(
    `netlify-lambda`,
    [
      `build`,
      `--babelrc`, `false`,
      `--config`, configPathRel,
      `netlify-functions`
    ],
    {
      cwd: dirs.site,
      stdio: `inherit`
    }
  )
}
