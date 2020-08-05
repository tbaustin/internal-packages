const path = require(`path`)
const chalk = require(`chalk`)
const child_process = require(`child_process`)
const dirs = require(`./../../dirs`)
const createNetlifyConfig = require(`../create-netlify-config`)
const createSanityConfig = require(`../create-sanity-config`)


exports.command = `dev`
exports.describe = `Runs entire stack in development mode`


exports.handler = async (argv) => {
  /**
   * Regenerate Netlify & Sanity configs
   */
  try {
    console.log(chalk.blueBright(
      `Regenerating configs for Netlify and Sanity...`
    ))

    await createNetlifyConfig()
    await createSanityConfig()

    console.log(chalk.blueBright(`Configs rewritten!\n`))
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
    cwd: dirs.cms,
    stdio: `inherit`
  })

  /**
   * Start dev server for Netlify functions
   */
  const configPathAbs = `${dirs.cli}/webpack.functions.js`
  const configPathRel = path.relative(dirs.site, configPathAbs)
  child_process.spawn(
    `netlify-lambda`,
    [`serve`, `--config`, configPathRel, `netlify-functions`],
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
