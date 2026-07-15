/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_VERDICTLAYER_INTEGRATION_MODE?: string;
  readonly VITE_GENLAYER_NETWORK_NAME?: string;
  readonly VITE_GENLAYER_RPC_URL?: string;
  readonly VITE_VERDICTLAYER_CONTRACT_ADDRESS?: string;
  readonly VITE_SHOW_GENLAYER_DIAGNOSTICS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
