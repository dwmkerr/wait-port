const assert = require('assert');
const net = require('net');
const waitPort = require('./wait-port');

describe('wait-port', () => {

  it('should reject if a port is not specified', () => {
    return waitPort({ })
      .then(() => {
        assert(false, 'Waiting without a port should reject.');
      })
      .catch((err) => {
        assert(err, 'An error should be provided');
        assert(/port/.test(err), 'Error message should mention port.');
      });
  });

  it('should wait until a port is open', (done) => {

    //  A variable which will hold the server we create for testing.
    let server = null;

    //  Start waiting for port 9021 to open. If it opens we pass, otherwise we
    //  fail.
    waitPort({ host: '127.0.0.1', port: 9021 })
      .then((open) => {
        assert(open === true, 'Waiting for the port should find it to open.');
        server.close();
        done();
      })
      .catch((err) => {
        assert(!err, 'Waiting for the port should not fail.');
        done();
      });

    //  Open the port for connections. Should cause the test to pass.
    server = net.createServer();
    server.listen(9021, '127.0.0.1');
  });

  it('should timeout after the specified time', (done) => {
    const timeout = 5000;
    const delta = 500;

    //  Start waiting for port 9021 to open.
    const start = new Date();
    waitPort({ host: '127.0.0.1', port: 9021, timeout })
      .then((open) => {
        assert(open === false, 'The port should not be open.');
        
        //  Make sure we are close to the timeout.
        const elapsed = new Date() - start;
        assert(((timeout - delta) < elapsed) && (elapsed < (timeout + delta)),
          `Timeout took ${elapsed}ms, should be close to ${timeout}ms.`);

        done();
      })
      .catch((err) => {
        assert(!err, 'Waiting for the port should not fail.');
      });
  });
});
