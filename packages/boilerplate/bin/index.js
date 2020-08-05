#!/usr/bin/env node

const cwd = process.cwd()
require(`dotenv`).config({ path: `${cwd}/.env` })

const cli = require(`yargs`)
const chalk = require(`chalk`)
const setDirs = require(`./set-dirs`)

const welcome = chalk.bold.magentaBright(`
  ✨  Welcome to the Escalade Sports Website Boilerplate  ✨
`)


!async function() {

  console.log(welcome)
  await setDirs()
  cli.commandDir(`commands`).help().argv

}()
