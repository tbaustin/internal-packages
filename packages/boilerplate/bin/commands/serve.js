const child_process = require(`child_process`)
const dirs = require(`./../../dirs`)


exports.command = `serve`
exports.describe = `Serves production bundle of Gatsby site & Sanity Studio`


exports.handler = () => {
  // Run `gatsby serve`
  child_process.spawn(
    `gatsby`,
    [`serve`, `-p`, `8000`],
    {
      cwd: dirs.site,
      stdio: `inherit`
    }
  )
}
