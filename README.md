# wait-port [![CircleCI](https://circleci.com/gh/dwmkerr/wait-port.svg?style=shield)](https://circleci.com/gh/dwmkerr/wait-port) [![codecov](https://codecov.io/gh/dwmkerr/wait-port/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/wait-port) [![npm version](https://badge.fury.io/js/wait-port.svg)](https://badge.fury.io/js/wait-port)

Simple binary to wait for a port to open. Useful when writing scripts which need to wait for a server to be availble, creating `docker-compose` commands which wait for servers to start and general server-side shenanigans. Can also wait for an HTTP endpoint to successfully respond.

<img src="https://github.com/dwmkerr/wait-port/raw/master/docs/wait-port.gif" alt="wait-port screenshot" width="520px" />

- [Installation](#installation)
- [Usage](#usage)
  - [Parameters](#parameters)
  - [Error Codes](#error-codes)
- [API](#api)
- [Developer Guide](#developer-guide)
  - [Debugging](#debugging)
  - [Testing](#testing)
  - [Testing the CLI](#testing-the-cli)
  - [Manpage](#manpage)
  - [Releasing](#releasing)
  - [Timeouts](#timeouts)

# Installation

Install globally with `npm`:

```
$ npm install -g wait-port
```

If installing locally, run the binary from the local node modules binary folder:

```
$ npm install wait-port
wait-port@0.1.3

$ ./node_modules/.bin/wait-port 8080
Waiting for localhost:8080.....
Connected!
```

# Usage

To wait indefinitely for a port to open, just use:

```bash
$ wait-port localhost:3000
```

To wait for a port to open, but limit to a certain timeout, use:

```bash
$ wait-port -t 10000 localhost:3000
```

To wait for an HTTP endpoint to respond with a 200 class status code, include the `http://` protocol:

```bash
$ wait-port http://:3000/healthcheck
```

### Parameters

The following parameters are accepted:

| Parameter | Usage |
|-----------|-------|
| `<target>` | Required. The target to test for. Can be just a port, a colon and port (as one would use with [httpie](https://httpie.org/) or host and port. Examples: `8080`, `:3000`, `127.0.0.1:443`. |
| `--output, -o`  | Optional. Output style to use. Can be `dots` (default) or `silent` (no output). |
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
| `--output`      | `output`      | Optional. Defaults to `dots`. Output style to use. `silent` also accepted. |
| `--timeout, -t` | `timeout` | Optional. Defaults to `0`. Timeout (in milliseconds). If `0`, then the operation will never timeout. |

# Developer Guide

This module uses:

| Name | Usage |
| [`chalk`](https://github.com/chalk/chalk) | Terminal output styling. |
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

Run tests continuously, watching source with `npm run test:watch`.

## Testing the CLI

Don't install the package to test the CLI. Instead, in the project folder run `npm link`. Now go to whatever folder you want to use the module in and run `npm link wait-port`. It will symlink the package and binary. See [`npm link`](https://docs.npmjs.com/cli/link) for more details.

### Manpage

Installing the CLI will install the manpage. The manpage is at [`./man/wait-port.1`](./man/wait-port.1). After updating the page, test it with `man ./man/wait-port.1` before publishing, as the format can be tricky to work with.

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
