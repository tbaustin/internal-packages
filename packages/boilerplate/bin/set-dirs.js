const path = require(`path`)
const fs = require(`fs`)
const util = require(`util`)
const writeFile = util.promisify(fs.writeFile)


const dirs = {
  cli: path.resolve(__dirname, `..`),
  site: process.cwd(),
  gatsbyTheme: path.dirname(
    require.resolve(`gatsby-theme-esca-boilerplate/package.json`)
  ),
  cms: path.dirname(
    require.resolve(`@escaladesports/cms/package.json`)
  )
}


module.exports = async function setDirs() {
  try {
    await writeFile(`${dirs.cli}/dirs.json`, JSON.stringify(dirs))
  }
  catch(err) {
    console.error(`There was a problem caching directories in dirs.json`)
    console.log(err)
    process.exit(1)
  }
}
