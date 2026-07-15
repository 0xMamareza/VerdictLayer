# VerdictLayer GenLayer Integration Checklist

## A. Current status

- Frontend mock flows are working.
- Integration mode is hardcoded to mock.
- GenLayerJS installed and SDK imports discovered.
- Wallet detection/connect UI added.
- GenLayer network detection UI added.
- Known networks configured: Studionet and Bradbury.
- Network switching UI added for Studionet.
- Bradbury metadata prepared.
- Env-based integration mode prepared.
- Read-only GenLayer client layer added.
- Read diagnostics UI added.
- Browser read smoke test can be run after adding local `.env`.
- Browser read smoke test succeeded.
- Contract read methods verified from frontend.
- Write transaction plan created.
- Write API inspected.
- Dev-only Claim write diagnostics implemented.
- Claim write diagnostics manually tested successfully.
- Transaction hash recorded.
- Read-after-write verified.
- Dev-only Task write diagnostics implemented.
- Task write diagnostics manually tested successfully.
- Task transaction hash recorded.
- Task read-after-write verified.
- Dev-only Dispute write diagnostics implemented.
- Dispute write diagnostics manually tested successfully.
- Dispute transaction hash recorded.
- Dispute read-after-write verified.
- Claim, Task, and Dispute diagnostic writes all verified.
- Production Claim form real integration implemented.
- Production Claim manual browser test succeeded.
- Claim transaction hash recorded.
- Claim typed read-after-write result verified.
- Mock fallback preserved.
- Production Task real integration implemented.
- Production Task manual browser test succeeded.
- Task transaction hash recorded.
- Task typed read-after-write result verified.
- Task `missingItems` normalization verified.
- Claim production integration remains verified.
- Task production integration remains verified.
- Production Dispute real integration implemented.
- Production Dispute manual browser test succeeded.
- Dispute transaction hash recorded.
- Dispute typed read-after-write result verified.
- Claim production path verified.
- Task production path verified.
- Dispute production path verified.
- All three real routes verified in `genlayer` mode.
- All three mock routes retained in `mock` mode.
- Production three-module integration milestone complete.
- All three modules are implemented behind `genlayer` mode.
- Mock fallback preserved for all three modules.
- Public deployment still pending.
- Disconnected-wallet guard verified for Claim.
- Disconnected-wallet guard verified for Task.
- Disconnected-wallet guard verified for Dispute.
- Unsupported-network guard verified for all three modules.
- Network-switch recovery verified.
- Wallet-rejection state verified for all three modules.
- Shared rejection-message cleanup implemented.
- Cleaned Claim rejection message manually verified.
- Cleaned Task rejection message manually verified.
- Cleaned Dispute rejection message manually verified.
- No SDK or provider internals exposed after rejection.
- Inputs preserved after rejection for all three modules.
- Retry state verified for all three modules.
- Production wallet-rejection error handling complete.
- All three manual browser diagnostic transaction tests completed.
- Production Claim, Task, and Dispute wallet-signed writes verified.
- Mock mode remains active.
- Deployed contract address is configured locally through ignored `.env`.

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
