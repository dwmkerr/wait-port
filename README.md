# wait-port [![CircleCI](https://circleci.com/gh/dwmkerr/wait-port.svg?style=shield)](https://circleci.com/gh/dwmkerr/wait-port) [![codecov](https://codecov.io/gh/dwmkerr/wait-port/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/wait-port)

Simple binary to wait for a port to open. Useful for docker-compose and general server side activities.

- [Usage](#usage)
  - [Parameters](#parameters)
  - [Error Codes](#error-codes)
- [API](#api)
- [Developer Guide](#developer-guide)
  - [Debugging](#debugging)
  - [Testing](#testing)
  - [Testing the CLI](#testing-the-cli)
  - [Releasing](#releasing)
  - [Timeouts](#timeouts)

# Usage

To wait for a port to open, just use:

```bash
$ wait-port localhost:3000
```

To wait for a port to open, but limit to a certain timeout, use:

```bash
$ wait-port -t 10000 localhost:3000
```

### Parameters

The following parameters are accepted:

| Parameter | Usage |
|-----------|-------|
| `<target>` | Required. The target to test for. Can be just a port, a colon and port (as one would use with [httpie](https://httpie.org/) or host and port. Examples: `8080`, `:3000`, `127.0.0.1:443`. |
| `--timeout, -t` | Optional. Timeout (in milliseconds). |

### Error Codes

The following error codes are returned:

| Code | Meaning |
|------|---------|
| `0`  | The specified port on the host is accepting connections. |
| `1`  | A timeout occured waiting for the port to open. |
| `2`  | Un unknown error occured waiting for the port to open. The program cannot establish whether the port is open or not. |

# API

You can use `wait-port` programmatically:

```
const waitPort = require('wait-port');

const params = {
  host: 'google.com',
  port: 443,
};

waitPort(params)
  .then((open) => {
    if (open) console.log('The port is now open!');
    else console.log('The port did not open before the timeout...');
  })
  .catch((err) => {
    console.err(`An unknown error occured while waiting for the port: ${err}`);
  });
```

The CLI is a very shallow wrapper around this function. The `params` object takes the following parameters:

| CLI Parameter | API Parameter | Notes |
|---------------|---------------|-------|
| `<target>`      | `host`        | Optional. Defaults to `localhost`. |
| `<target>`      | `port`        | Required. Port to wait for. |
| `--timeout, -t` | `timeout` | Optional. Defaults to `0`. Timeout (in milliseconds). If `0`, then the operation will never timeout. |

# Developer Guide

This module uses:

| Name | Usage |
| [`commander.js`](https://github.com/tj/commander.js) | Utility for building commandline apps. |
| [`debug`](https://github.com/visionmedia/debug) | Utility for debug output. |
R [`mocha`](https://mochajs.org/) / [`nyc`](https://github.com/istanbuljs/nyc) | Test runner / coverage. |

## Debugging

This module use [`debug`](https://github.com/visionmedia/debug) for debug output. Set `DEBUG=wait-port` to see detailed diagnostic information:

```bash
DEBUG=wait-port wait-for -t 10000 localhost:6234
```

This will also work for any code which uses the API.

## Testing

Run unit tests with `npm test`. Coverage is reported to `artifacts/coverage`.

Debug unit tests with `npm run debug`. Add a `debugger` statement to the line you are interested in, and consider limiting scope with [`.only`](https://mochajs.org/#exclusive-tests).

## Testing the CLI

Don't install the package to test the CLI. Instead, in the project folder run `npm link`. Now go to whatever folder you want to use the module in and run `npm link wait-port`. It will symlink the package and binary. See [`npm link`](https://docs.npmjs.com/cli/link) for more details.

## Releasing

Kick out a new release with:

```bash
npm version patch # or minor/major
git push --tags
npm publish
```

## Timeouts

The timeout option for `waitPort` is used terminate attempts to open the socket *after* a certain amount of time has passed. Please note that operations can take significantly longer than the timeout. For example:

```js
const promise = waitPort({ port: 9000, interval: 10000 }, 2000);
```

In this case, the socket will only attempt to connect every ten seconds. So on the first iteration, the timeout is not reached, then another iteration will be scheduled for after ten seconds, meaning the timeout will happen eight seconds later than one might expect.

The `waitPort` promise may take up to `interval` milliseconds greater than `timeout` to resolve.

## TODO

Some more tasks to complete:

 - [ ] Support validation of the timeout commandline parameter
 - [ ] Add an interval commandline parameter
 - [X] Document how to use the API
 - [ ] Package with `pkg`
 - [X] Diagnostic output with `debug`
 - [ ] Finalise output format, colourise.
 - [ ] Support output on the interval (with an -o option).
 - [ ] NPM badge
