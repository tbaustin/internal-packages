
const subPlugins = [
  require(`./cms-pages`),
  require(`./cms-templates`),
  require(`./cms-redirects`),
  require(`./search`),
  require(`./products-categories`)
]

const lifecycleMethods = [
  `sourceNodes`,
  `createResolvers`,
  `createSchemaCustomization`,
  `createPages`,
  `onCreatePage`,
  `onPostBuild`
]

module.exports = lifecycleMethods.reduce((moduleExports, method) => {
  const functionToExport = async (helpers, options) => {
    for (let plugin of subPlugins) {
      if (plugin[method]) await plugin[method](helpers, options)
    }
  }

  return {
    ...moduleExports,
    [method]: functionToExport
  }
}, {})
