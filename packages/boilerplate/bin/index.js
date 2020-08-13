#!/usr/bin/env node

const cwd = process.cwd()
require(`dotenv`).config({ path: `${cwd}/.env` })
const cli = require(`yargs`)
const {
  welcome,
  setDirs,
  configExists,
  ensureConfigExists
} = require(`./utils`)


!async function() {

  welcome()
  await setDirs()

  /**
   * When no config.js is present in the project, only allow 'init' command or
   * '-'/'--' flags without a command
   */
  const command = process.argv[2] || ``
  const shouldIncludeInitOnly = command === `init` || (
    command.startsWith(`-`) && !configExists()
  )

  if (shouldIncludeInitOnly) {
    const init = require(`./commands/init`)
    cli.command(init).help().argv
  }
  else {
    /**
     * If any other command is being attempted, include all commands in CLI but
     * exit with a warning if no config.js is present (avoids failed 'require()'
     * statements in commands using config)
     */
    ensureConfigExists()
    cli.commandDir(`commands`).help().argv
  }

}()
