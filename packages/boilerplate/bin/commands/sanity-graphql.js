const child_process = require(`child_process`)
const dirs = require(`./../../dirs`)


exports.command = `sanity-graphql`
exports.describe = `Deploys the GraphQL API for the Sanity dataset in use`


exports.handler = async () => {
  child_process.spawn(`sanity`, [`graphql`, `deploy`], {
    cwd: dirs.cms,
    stdio: `inherit`
  })
}
