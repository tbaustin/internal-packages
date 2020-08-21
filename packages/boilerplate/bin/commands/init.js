const { outputFile } = require(`fs-extra`)
const { notify, warn, configExists } = require(`./../utils`)
const dirs = require(`./../../dirs`)
const package = require(`./../../package.json`)


exports.command = `init`
exports.describe = `Initializes a new website project`


const tasks = []

const write = (fileName, data) => {
  const output = typeof data === `object`
    ? JSON.stringify(data, null, `\t`)
    : data
  const promise = outputFile(`${dirs.site}/${fileName}`, output)
  tasks.push(promise)
}


async function initProjectFiles() {
  write(
    `package.json`,
    {
      name: ``,
      version: `0.0.0`,
      private: true,
      scripts: {
        env: `esca env`,
        netlify: `esca netlify`,
        "ls-link": `esca ls-link`,
        "sanity-graphql": `esca sanity-graphql`,
        dev: `esca dev`,
        build: `esca build`
      },
      dependencies: {
        "@escaladesports/boilerplate": `^${package.version}`,
        ...package.peerDependencies
      }
    }
  )

  write(
    `.gitignore`,
    [
      `netlify.toml`,
      `node_modules`,
      `public`,
      `.cache`,
      `.env`,
      `temp-cms`
    ].join(`\n`)
  )

  write(
    `.babelrc`,
    {
      presets: [
        `babel-preset-gatsby`,
        [
          `@escaladesports/babel-preset`,
          {
            gatsby: true
          }
        ]
      ]
    }
  )

  write(`.eslintrc`, ``)

  write(`.nvmrc`, `12.15.0`)

  write(
    `config.js`,
`module.exports = {
	escaladeSite: \`\`,
	siteId: \`\`,
	sanityName: \`\`,
	sanityProjectId: \`\`,
	sanityDataset: \`\`,
  googleTagManagerId: \`\`,
  activeCampaign: {
		integrationName: \`\`,
		integrationLogo: \`\`,
		account: \`\`,
		sandboxAccount: \`\`,
		origin: \`\`,
		devOrigin: \`\`,
		host: \`\`,
		devMode: false
	},
	apiStages: {
		cart: \`test\`,
		products: \`prod\`
	}
}`
  )

  write(
    `gatsby-config.js`,
`module.exports = {
  plugins: [
    {
      resolve: \`gatsby-theme-esca-boilerplate\`,
      options: {
        icon: \`\`
      }
    },
    {
      resolve: \`gatsby-plugin-compile-es6-packages\`,
      options: {
        modules: [\`gatsby-theme-esca-boilerplate\`]
      }
    }
  ]
}`
  )

  write(`netlify-functions/.gitignore`, `dist`)

  return Promise.all(tasks)
}


exports.handler = async () => {
  if (configExists()) {
    warn(`\nProject has already been initialized. Exiting...\n`)
    process.exit()
  }

  notify(`\nInitializing project structure...\n`)

  try {
    await initProjectFiles()
    notify(`Files written!\n`)
    notify(`
      Next steps:
      \t- Add a name in package.json
      \t- Fill out config.js with necessary info
      \t- Run 'nvm use'
      \t- Run 'yarn'
      \t- Run 'yarn env'
      \t- Run 'yarn netlify'
      \t- Run 'git init'
      \t- Push repo to GitHub
    `)
  }
  catch(err) {
    warn(`Unable to initialize project. See below.\n`)
    console.error(err)

    warn(`\nExiting...\n`)
    process.exit()
  }
}
