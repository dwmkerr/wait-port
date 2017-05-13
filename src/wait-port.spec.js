const assert = require('assert');
const net = require('net');
const process = require('process');
const waitPort = require('./wait-port');

describe('wait-port', () => {

  it('should wait until a port is open', (done) => {

    //  A variable which will hold the server we create for testing.
    let server = null;

    //  Start waiting for port 9021 to open. If it opens we pass, otherwise we
    //  fail.
    waitPort({ host: '127.0.0.1', port: 9021 })
      .then((open) => {
        assert.equal(open, true, 'Waiting for the port should find it to open.');
        server.close();
        done();
      })
      .catch((err) => {
        assert.fail(err, 'Waiting for the port should not fail.');
        done();
      });

    //  Open the port for connections. Should cause the test to pass.
    server = net.createServer();
    server.listen(9021, '127.0.0.1');
  });

  xit('should timeout after the specified time', () => {
    // start waiting
    // show the promise is not resolved
    // wait
    // show the promise rejects
  });
});
