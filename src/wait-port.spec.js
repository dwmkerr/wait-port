const assert = require('assert');
const net = require('net');
const process = require('process');
const waitPort = require('./wait-port');

describe('wait-port', () => {

  it('should wait until a port is open', (done) => {

    //  Start waiting for port 9021 to open.
    let status = undefined;
    waitPort({ host: '127.0.0.1', port: 9021 })
      .then(() => { status = true; })
      .catch((err) => { console.log(err); status = false; });

    //  Check we have not yet resolved.
    assert.equal(status, undefined, 'Status should still be undefined.');

    //  Open up the port.
    setTimeout(() => {
      const server = net.createServer();
      server.listen(9021, '127.0.0.1', () => {
        setTimeout(() => {
          assert.equal(status, true, 'Status should show port is open.');
          server.close(done);
        }, 1000);
      });
    }, 10000);
  });

  xit('should timeout after the specified time', () => {
    // start waiting
    // show the promise is not resolved
    // wait
    // show the promise rejects
  });
});
