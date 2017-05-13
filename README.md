# wait-port [![CircleCI](https://circleci.com/gh/dwmkerr/wait-port.svg?style=shield)](https://circleci.com/gh/dwmkerr/wait-port) 
[![codecov](https://codecov.io/gh/dwmkerr/wait-port/branch/master/graph/badge.svg)](https://codecov.io/gh/dwmkerr/wait-port)

Simple binary to wait for a port to open. Useful for docker-compose and general server side activities.

## Timeouts

The timeout option for `waitPort` is used terminate attempts to open the socket *after* a certain amount of time has passed. Please note that operations can take significantly longer than the timeout. For example:

```js
const promise = waitPort({ port: 9000, interval: 10000 }, 2000);
```

In this case, the socket will only attempt to connect every ten seconds. So on the first iteration, the timeout is not reached, then another iteration will be scheduled for after ten seconds, meaning the timeout will happen eight seconds later than one might expect.

The `waitPort` promise may take up to `interval` milliseconds greater than `timeout` to resolve.
