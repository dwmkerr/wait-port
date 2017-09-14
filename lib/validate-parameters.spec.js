const assert = require('assert');
const validateParameters = require('./validate-parameters');

describe('validateParameters', () => {
  const validParams = () => {
    return {
      host: 'localhost',
      port: 8080,
      interval: 2000,
      timeout: 0,
      output: 'silent'
    };
  };

  it('should allow an undefined protocol', () => {

    const params = validParams();
    assert.equal(validateParameters(params).protocol, undefined);

  });

  it('should forbid any non-http protocol', () => {

    let params = validParams();
    params.protocol = 'https';
    assert.throws(() => validateParameters(params), /protocol.*http/);

  });

  it('should throw if no port is not specified', () => {

    const params = validParams();
    delete params.port;
    assert.throws(() => validateParameters(params), /port.*required/);

  });

  it('should throw if an invalid port is specified', () => {

    let params = validParams();
    params.port = 'string';
    assert.throws(() => validateParameters(params), /port.*number/);
    params.port = -1;
    assert.throws(() => validateParameters(params), /port.*0/);
    params.port = 65536;
    assert.throws(() => validateParameters(params), /port.*65535/);

  });

  it('coerce an empty host into \'localhost\'', () => {
	
    const params = validParams();
    delete params.host;
    const validatedParams = validateParameters(params);
    assert.equal(validatedParams.host, 'localhost');

  });

  it('should allow an undefined path', () => {

    const params = validParams();
    assert.equal(validateParameters(params).path, undefined);
  
  });

  it('should set the path to root if the http protocol is used but no path is specified', () => {

    let params = validParams();
    params.protocol = 'http';
    assert.equal(validateParameters(params).path, '/');

  });

  it('coerce an empty interval into \'1000\'', () => {

    const params = validParams();
    delete params.interval;
    const validatedparams = validateParameters(params);
    assert.equal(validatedparams.interval, 1000);

  });

  it('should throw if an invalid interval is specified', () => {

    const params = validParams();
    params.interval = 'string';
    assert.throws(() => validateParameters(params), /interval.*number/);
    params.interval = -1;
    assert.throws(() => validateParameters(params), /interval.*0/);

  });

  it('should coerce an empty timeout into \'0\'', () => {

    const params = validParams();
    delete params.timeout;
    const validatedparams = validateParameters(params);
    assert.equal(validatedparams.timeout, 0);

  });

  it('should throw if an invalid timeout is specified', () => {

    const params = validParams();
    params.timeout = 'string';
    assert.throws(() => validateParameters(params), /timeout.*number/);
    params.timeout = -1;
    assert.throws(() => validateParameters(params), /timeout.*0/);

  });

  it('should coerce an empty output into \'dots\'', () => {

    const params = validParams();
    delete params.output;
    const validatedparams = validateParameters(params);
    assert.equal(validatedparams.output, 'dots');

  });

  it('should throw if an invalid output is specified', () => {

    const params = validParams();
    params.output = 'something';
    assert.throws(() => validateParameters(params), /output.*silent.*dots/);

  });

});
