interface ServerLocation {
  port: number;
  host?: string;
}

const waitPort: (server: ServerLocation, timeout?: number) => Promise<boolean>;

export default waitPort;
