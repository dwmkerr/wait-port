function extractTarget(target) {
  if (!target) throw new Error('\'target\' is required');

  //  Split the target by the separator (which might not be present.
  const split = target.split(':');
  if (split.length > 2) throw new Error('\'target\' is invalid');

  //  Grab the host and port (which will still be a string).
  const host = split.length === 2 ? (split[0] || undefined) : undefined;
  const portString = split.length === 1 ? split[0] : split[1];

  //  Make sure the port is numeric.
  if (!/^[0-9]+$/.test(portString)) throw new Error('\'port\' must be a number');
  const port = parseInt(portString, 10);

  //  That's it, return the extracted target.
  return { host, port };
}

module.exports = extractTarget;
