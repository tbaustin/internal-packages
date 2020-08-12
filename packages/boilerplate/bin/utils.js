const path = require(`path`)
const { outputJson, copy, remove } = require(`fs-extra`)
const chalk = require(`chalk`)
const dirs = require(`./../dirs`)


const warn = text => console.log(chalk.yellow(text))
const notify = text => console.log(chalk.blueBright(text))
const resolveDir = moduleName => path.dirname(require.resolve(moduleName))

const cwd = process.cwd()


async function setDirs() {
  const dirs = {
    cli: path.resolve(__dirname, `..`),
    site: cwd,
    gatsbyTheme: resolveDir(`gatsby-theme-esca-boilerplate/package.json`),
    cms: resolveDir(`@escaladesports/cms/package.json`),
    tempCms: `${cwd}/temp-cms`
  }

  try {
    await outputJson(`${dirs.cli}/dirs.json`, dirs, { spaces: `\t` })
  }
  catch(err) {
    warn(`\nThere was a problem caching directories in dirs.json (see below)\n`)
    console.error(err)
    warn(`\nExiting...\n`)
    process.exit(1)
  }
}


function configExists() {
  try {
    const config = require(`${cwd}/config`)
    return !!config
  }
  catch(err) {
    if (err.code === `MODULE_NOT_FOUND`) {
      return false
    }
    else {
      warn(`There was a problem while checking for config. See details below.`)
      console.error(err)
      warn(`\nExiting...\n`)
      process.exit(1)
    }
  }
}


function ensureConfigExists() {
  if (configExists()) return

  warn(
    `It looks like no project has been initialized in this directory.\n`
    + `Please check that you're in the correct directory or run \`esca `
    + `init\`/\`boilerplate init\`to initialize with config.\n`
  )
  warn(`Exiting...\n`)
  process.exit()
}


async function copyTempCms() {
  await remove(dirs.tempCms)
  return copy(dirs.cms, dirs.tempCms)
}


module.exports = {
  warn,
  notify,
  setDirs,
  resolveDir,
  configExists,
  ensureConfigExists,
  copyTempCms
}
