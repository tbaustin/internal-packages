const fs = require(`fs`)
const util = require(`util`)
const readDir = util.promisify(fs.readdir)
const { notify } = require(`./../utils`)
const dirs = require(`./../../dirs`)


async function getLinkedPackageNames(searchPath, parentNamespace) {
  const output = []
  const files = await readDir(searchPath, { withFileTypes: true })

  for (let file of files) {
    const isNamespace = file.name.startsWith(`@`)

    if (isNamespace) {
      let subPath = `${searchPath}/${file.name}`
      let subFiles = await getLinkedPackageNames(subPath, file.name)
      output.push(...subFiles)
    }

    const isLinkedPackage = !isNamespace && file.isSymbolicLink()
    if (!isLinkedPackage) continue

    const packageName = parentNamespace
      ? `${parentNamespace}/${file.name}`
      : file.name
    output.push(packageName)
  }

  return output
}


const message = `\nThese packages are locally linked to your current project:`
const noPackagesMessage = `
  There are no packages locally linked to your current project.
`


exports.command = `ls-link`
exports.describe = `Shows packages locally linked to website project via Yarn/NPM`


exports.handler = async () => {
  try {
    let modulesPath = `${dirs.site}/node_modules`
    let linkedPackageNames = await getLinkedPackageNames(modulesPath)

    if (!linkedPackageNames.length) {
      notify(noPackagesMessage)
      return
    }

    notify(message)
    console.log(
      linkedPackageNames
        .map(name => `\t${name}`)
        .join(`\n`) + `\n`
    )
  }
  catch(err) {
    // Just don't show errors...we don't care :P
    // (most likely node_modules not existing)
    notify(noPackagesMessage)
  }
}
