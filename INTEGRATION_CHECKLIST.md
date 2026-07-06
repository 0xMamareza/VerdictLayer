# VerdictLayer GenLayer Integration Checklist

## A. Current status

- Frontend mock flows are working.
- Integration mode is hardcoded to mock.
- GenLayerJS installed and SDK imports discovered.
- No wallet connection yet.
- No deployed contract address yet.

## B. Required decisions before real integration

- Target network: local Studio, Bradbury testnet, or other.
- Contract deployment method: GenLayer Studio manual deploy or CLI deploy.
- Wallet strategy.
- Contract address storage.
- Read/write method names.
- Sync vs async frontend flow.

## C. Required environment variables for future integration

- `VITE_VERDICTLAYER_INTEGRATION_MODE`
- `VITE_GENLAYER_NETWORK_NAME`
- `VITE_GENLAYER_RPC_URL`
- `VITE_VERDICTLAYER_CONTRACT_ADDRESS`

## D. Future installation step

GenLayerJS should only be installed after the contract is deployed and method signatures are final.

## E. Future integration sequence

1. Finalize Python Intelligent Contract.
2. Deploy contract manually in GenLayer Studio or CLI.
3. Save contract address and network details.
4. Install GenLayerJS if required.
5. Replace verdictLayerRealClient placeholder with real calls.
6. Switch integration mode from mock to genlayer.
7. Test all three modules.
8. Keep mock mode as fallback.

## F. Risk checklist

- Async transaction state.
- Wallet not connected.
- Wrong network.
- Contract address missing.
- Method signature mismatch.
- Non-deterministic result delay.
- Failed transaction.
- Validator/consensus delay.
- Malformed AI JSON result.
