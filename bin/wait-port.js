#!/usr/bin/env node
const chalk = require('chalk');
const debug = require('debug')('wait-port');
const program = require('commander');
const pkg = require('../package.json');
const extractTarget = require('../lib/extract-target');
const ConnectionError = require('../lib/errors/connection-error');
const TargetError = require('../lib/errors/target-error');
const ValidationError = require('../lib/errors/validation-error');
const waitPort = require('../lib/wait-port');

program
  .version(pkg.version)
  .description('Wait for a target to accept connections, e.g: wait-port localhost:8080')
  .option('-t, --timeout [n]', 'Timeout', parseInt)
  .option('-o, --output [mode]', 'Output mode (silent, dots). Default is silent.')
  .option('--wait-for-dns', 'Do not fail on ENOTFOUND, meaning you can wait for DNS record creation. Default is false.')
  .arguments('<target>')
  .action(async (target) => {
    try {
      const options = program.opts();
      const { protocol, host, port, path } = extractTarget(target);
      const timeout = options.timeout || 0;
      const output = options.output;
      const waitForDns = options.waitForDns;

      debug(`Timeout: ${timeout}`);
      debug(`Target: ${target} => ${protocol}://${host}:${port}${path}`);
      debug(`waitForDns: ${waitForDns}`);

      const params = {
        timeout,
        protocol,
        host,
        port,
        path,
        output,
        waitForDns,
      };

      const { open } = await waitPort(params);
      process.exit(open ? 0 : 1);
    } catch (err) {
      //  Show validation errors in red.
      if (err instanceof ValidationError) {
        console.error(chalk.red(`\n  Validation Error: ${err.message}`));
        process.exit(2);
      } else if (err instanceof ConnectionError) {
        console.error(chalk.red(`\n\n  Connection Error Error: ${err.message}`));
        process.exit(4);
      } else if (err instanceof TargetError) {
        console.error(chalk.red(`\n  Target Error: ${err.message}`));
        process.exit(4);
      } else {
        console.error(chalk.red(`\n  Unknown error occurred waiting for ${target}: ${err}`));
        process.exit(3);
      }
    }
  });

//  Enrich the help.
program.on('--help', () => {
  console.log('  Examples:');
  console.log('');
  console.log('    $ wait-port 3000');
  console.log('    $ wait-port -t 10 :8080');
  console.log('    $ wait-port google.com:443');
  console.log('    $ wait-port http://localhost:5000/healthcheck');
  console.log('    $ wait-port --wait-for-dns http://mynewdomain.com:80');
  console.log('');
});

//  Parse the arguments. Spaff an error message if none were provided.
program.parse(process.argv);
if (program.args.length === 0) {
  program.help();
}
