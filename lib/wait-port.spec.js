const assert = require('assert');
const net = require('net');
const waitPort = require('./wait-port');

describe('wait-port', () => {

  it('should wait until a port is open', () => {

    const server = net.createServer();
    server.listen(9021, '127.0.0.1');

    //  Start waiting for port 9021 to open. If it opens we pass, otherwise we
    //  fail.
    return waitPort({ host: '127.0.0.1', port: 9021, output: 'silent' })
      .then((open) => {
        assert(open === true, 'Waiting for the port should find it to open.');
        server.close();
      });
  });

  it('should timeout after the specified time', () => {
    const timeout = 5000;
    const delta = 500;

    //  Start waiting for port 9021 to open.
    const start = new Date();
    return waitPort({ host: '127.0.0.1', port: 9021, timeout, output: 'silent' })
      .then((open) => {
        assert(open === false, 'The port should not be open.');
        
        //  Make sure we are close to the timeout.
        const elapsed = new Date() - start;
        assert(((timeout - delta) < elapsed) && (elapsed < (timeout + delta)),
          `Timeout took ${elapsed}ms, should be close to ${timeout}ms.`);
      });
  });
  
  it('should timeout after the specified time even with a non-routable address', () => {
    return waitPort({ host: '10.255.255.1', port: 9021, timeout: 500, output: 'silent' })
      .then((open) => {
        assert(open === false, 'The port should not be open.');
      });
  });
});
