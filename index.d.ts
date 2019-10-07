interface ServerLocation {
  /** The port to wait for */
  port: number;

  /** The host to check, if not localhost */
  host?: string;

  /** Set to 'http' to test an HTTP request as well */
  protocol?: 'http';

  /** If using the 'http' protocol, the path to check */
  path?: string;

  /** The number of milliseconds to wait on each connection attempt
   * (defaults to 0) */
  timeout?: number;

  /** Whether to wait for DNS to resolve, defaults to false */
  waitForDns?: boolean;

  /** Output mode */
  output?: 'dots' | 'silent';
}

declare const waitPort: (server: ServerLocation, timeout?: number) => Promise<boolean>;

export default waitPort;
