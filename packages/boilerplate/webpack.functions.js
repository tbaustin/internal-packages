const fs = require(`fs`)
const dirs = require(`./dirs`)

/**
 * This is the Webpack configuration used by netlify-lambda
 *
 * Needed in order to have "built-in" Netlify functions in boilerplate as well
 * as custom ones in the site using the boilerplate
 *
 * This enables netlify-lambda to bundle and serve function files defined in
 * both places
 */

/**
 * Filters a list of filenames by valid JavaScript files
 */
const byJsFiles = name => {
  return ![`.gitignore`, `dist`].includes(name) && name.includes(`.js`)
}

/**
 * Creates an object containing Webpack entries for all JS files directly in a
 * specified directory (uses filename before `.js` as the entry name)
 */
function getEntries(path) {
  const allFiles = fs.readdirSync(path)
  const entryFiles = allFiles.filter(byJsFiles)

  return entryFiles.reduce((entries, fileName, idx) => {
    const entryName = fileName.split(`.`)[0] || `entry${idx}`
    const entryPath = `${path}/${fileName}`

    return {
      ...entries,
      [entryName]: entryPath
    }
  }, {})
}

/**
 * Create Webpack entries for all JS files in `netlify-functions` directory of
 * both boilerplate & site (files w/ same name in site override boilerplate)
 */
const boilerplateEntries = getEntries(`${dirs.cli}/netlify-functions`)
const siteEntries = getEntries(`${dirs.site}/netlify-functions`)

module.exports = {
  entry: { ...boilerplateEntries, ...siteEntries }
}
