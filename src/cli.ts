const { build } = require('gluegun')

/**
 * Create the cli and kick it off
 */
async function run(argv: any) {
  // create a CLI runtime
  const cli = build()
    .brand('tsdx')
    .src(__dirname)
    .plugins('./node_modules', { matching: 'tsdx-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .create()

  // and run it
  const toolbox = await cli.run(argv)

  // send it back (for testing, mostly)
  return toolbox
}

module.exports = { run }
