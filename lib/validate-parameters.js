const outputFunctions = require('./output-functions');
const ValidationError = require('./validation-error');

function validateParameters(params) {
  //  Validate and coerce the port.
  const port = params.port;
  if (!port) throw new ValidationError('\'port\' is required.');
  if (!Number.isInteger(port)) throw new ValidationError('\'port\' must be a number.');
  if (port < 1) throw new ValidationError('\'port\' must be greater than 0.');
  if (port > 65535) throw new ValidationError('\'port\' must not be greater than 65535.');

  //  Coerce the host.
  const host = params.host || 'localhost';

  //  Validate and coerce the interval.
  const interval = params.interval || 1000;
  if (!Number.isInteger(interval)) throw new ValidationError('\'interval\' must be a number.');
  if (interval < 0) throw new ValidationError('\'interval\' must be greater or equal to 0.');

  //  Validate and coerce the timeout.
  const timeout = params.timeout || 0;
  if (!Number.isInteger(timeout)) throw new ValidationError('\'timeout\' must be a number.');
  if (timeout < 0) throw new ValidationError('\'timeout\' must be greater or equal to 0.');

  //  Coerce the output.
  const output = params.output || 'dots';

  //  The only valid output options are out named output functions.
  if (!outputFunctions[output]) {
    const validOutputFunctions = Object.keys(outputFunctions);
    const set = validOutputFunctions.join(', ');
    const errorMessage = `'output' must be in the set ${set}`;
    throw new ValidationError(errorMessage);
  }

  return {
    port,
    host,
    interval,
    timeout,
    output
  };
}

module.exports = validateParameters;
