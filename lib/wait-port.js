const debug = require('debug')('wait-port');
const net = require('net');

function createConnectionWithTimeout(params, timeout, callback) {
  //  Try and open the socket, with the params and callback.
  const socket = net.createConnection(params, callback);

  //  Variale to hold the timer we'll use to kill the socket if we don't
  //  connect in time.
  let timer = null;

  //  TODO: Check for the socket ECONNREFUSED event.
  socket.on('error', (error) => {
    debug(`Socket error: ${error}`);
    clearTimeout(timer);
    socket.destroy();
    callback(error);
  });

  //  Kill the socket if we don't open in time.
  timer = setTimeout(() => {
    socket.destroy();
    const error = new Error(`Timeout trying to open socket to ${params.host}:${params.port}`);
    error.code = 'ECONNTIMEOUT';
    callback(error);
  }, timeout);

  //  Return the socket.
  return socket;
}

//  This function attempts to open a connection, given a limited time window.
//  This is the function which we will run repeatedly until we connect.
function tryConnect(options, timeout) {
  return new Promise((resolve, reject) => {
    try {
      const socket = createConnectionWithTimeout(options, timeout, (err) => {
        if (err) {
          if (err.code === 'ECONNREFUSED') {
            //  We successfully *tried* to connect, so resolve with false so
            //  that we try again.
            debug('Socket not open: ECONNREFUSED');
            socket.destroy();
            return resolve(false);
          } else if (err.code === 'ECONNTIMEOUT') {
            //  We've successfully *tried* to connect, but we're timing out
            //  establishing the connection. This is not ideally (either
            //  the port is open or it ain't.
            debug('Socket not open: ECONNTIMEOUT');
            socket.destroy();
            return resolve(false);
          }

          //  Trying to open the socket has resulted in an error we don't
          //  understand. Better give up.
          debug(`Unexpected error trying to open socket: ${err}`);
          socket.destroy();
          return reject(err);
        }
      
        //  Boom, we connected! Disconnect, stop the timer and resolve.
        debug('Socket connected!');
        socket.destroy();
        resolve(true);
      });
    } catch (err) {
      //  Trying to open the socket has resulted in an exception we don't
      //  understand. Better give up.
      debug(`Unexpected exception trying to open socket: ${err}`);
      return reject(err);
    }
  });
}

function waitPort(params) {
  return new Promise((resolve, reject) => {
    //  Validate the parameters.
    if (!params.host) return reject(new Error('\'port\' is required.'));

    //  Create the parameters.
    const port = params.port;
    const host = params.host || 'localhost';
    const interval = params.interval || 1000;
    const timeout = params.timeout || 0;

    //  Keep track of the start time (needed for timeout calcs).
    const startTime = new Date();

    //  Don't wait for more than connectTimeout to try and connect.
    const connectTimeout = 1000;

    //  Start trying to connect.
    const loop = () => {
      tryConnect({ host, port }, connectTimeout)
        .then((open) => {
          //  We'll try the loop again, after the interval.
          debug(`Socket status is: ${open}`);

          //  The socket is open, we're done.
          if (open) return resolve(true);

          //  If we have a timeout, and we've passed it, we're done.
          if (timeout && (new Date() - startTime) > timeout) {
            return resolve(false);
          }

          //  Run the loop again.
          return setTimeout(loop, interval);
        })
        .catch((err) => {
          debug(`Unhandled error occured trying to connect: ${err}`);
          return reject(err);
        });
    };

    //  Start the loop.
    loop(connectTimeout);
  });
}

module.exports = waitPort;
