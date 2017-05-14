#!/usr/bin/env node
const debug = require('debug')('wait-port');
const program = require('commander');
const pkg = require('../package.json');
const extractTarget = require('../lib/extract-target');
const waitPort = require('../lib/wait-port');

program
  .version(pkg.version)
  .description('Wait for a target to accept connections, e.g: wait-port localhost:8080')
  .option('-t, --timeout <n>', 'Timeout', parseInt)
  .arguments('<target>')
  .action((target) => {
    //  Validate the parameters (extractTarget) will throw if target is invalid).
    const { host, port } = extractTarget(target);
    const timeout = program.timeout || 0;

    debug(`Timeout: ${timeout}`);
    debug(`Target: ${target} => ${host}:${port}`);

    const params = {
      timeout,
      host,
      port
    };

    waitPort(params)
      .then((open) => {
        if (open) {
          console.log(`${port} is accepting connections.`);
          process.exit(0);
        } else {
          console.log(`Timeout waiting for ${port}.`);
          process.exit(1);
        }
      })
      .catch((err) => {
        console.error(`Unknown error occured waiting for ${port}: ${err}`);
      });
  });

//  Enrich the help.
program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ wait-port 3000');
  console.log('    $ wait-port -t 10 :8080');
  console.log('    $ wait-port google.com:443');
  console.log('');
});

//  Parse the arguments. Spaff an error message if none were provided.
program.parse(process.argv);
if (program.args.length === 0) {
  program.help();
}
