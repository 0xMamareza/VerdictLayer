export type EthereumRequestArgs = {
  method: string;
  params?: unknown[] | object;
};

export type EthereumProvider = {
  request(args: EthereumRequestArgs): Promise<unknown>;
  on?(eventName: string, listener: (...args: unknown[]) => void): void;
  removeListener?(eventName: string, listener: (...args: unknown[]) => void): void;
  isMetaMask?: boolean;
};

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

