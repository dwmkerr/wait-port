function extractTarget(target) {
  if (!target) throw new Error('\'target\' is required');

  //  First, check to see if we have a protocol specified.
  const protocol = target.toLowerCase().startsWith('http://') ? 'http' : undefined;

  //  If we have a protocol, we can rip it out of the string.
  target = protocol ? target.substring('http://'.length) : target;

  //  If we have a protocol, we can also rip out the path (if there is one).
  const pathStart = target.indexOf('/');
  const path = pathStart !== -1 ? target.substring(pathStart) : undefined;
  target = pathStart !== -1 ? target.substring(0, pathStart) : target;

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
  return { protocol, host, port, path };
}

module.exports = extractTarget;
