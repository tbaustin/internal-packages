#!/usr/bin/env node

const cwd = process.cwd()
require(`dotenv`).config({ path: `${cwd}/.env` })
const cli = require(`yargs`)
const chalk = require(`chalk`)
const { setDirs, ensureConfigExists } = require(`./utils`)


const welcome = chalk.bold.magentaBright(`
  ✨  Welcome to the Escalade Sports Website Boilerplate  ✨
`)


!async function() {

  console.log(welcome)
  await setDirs()

  const command = process.argv[2]

  if (command === `init`) {
    const init = require(`./commands/init`)
    cli.command(init).help().argv
  }
  else {
    ensureConfigExists()
    cli.commandDir(`commands`).help().argv
  }

}()
