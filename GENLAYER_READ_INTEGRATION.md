# GenLayer Read Integration

## Current Status

VerdictLayer now has a read-only GenLayer client layer for the deployed deterministic contract. Runtime still defaults to mock mode, and the frontend forms are not wired to real contract reads or writes yet.

## Required Environment Variables

Create a local `.env` file only when you are ready to test real reads:

```text
VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer
VITE_GENLAYER_NETWORK_NAME=studionet
VITE_VERDICTLAYER_CONTRACT_ADDRESS=<your deployed contract address>
```

Do not commit `.env`. The contract address is public, but private keys, seed phrases, wallet secrets, and API keys must never be stored in this project.

## Read Layer

`src/lib/genlayerReadClient.ts` selects the GenLayer chain from `VITE_GENLAYER_NETWORK_NAME` and exposes read-only calls for the current VerdictLayer contract methods.

`src/lib/genlayerReadSmokeTest.ts` exposes a helper for future manual testing:

- `get_contract_version`
- `get_latest_claim_verdict`
- `get_latest_task_verdict`
- `get_latest_dispute_verdict`

## Manual Browser Smoke Test

1. Create a local `.env` file manually.
2. Add:

```text
VITE_VERDICTLAYER_INTEGRATION_MODE=mock
VITE_GENLAYER_NETWORK_NAME=studionet
VITE_VERDICTLAYER_CONTRACT_ADDRESS=<your deployed contract address>
```

3. Run:

```powershell
npm run dev
```

4. Open the local site.
5. Use the GenLayer Read Diagnostics panel.
6. Click "Run Read Smoke Test".
7. Confirm the four read outputs appear.

Keep `VITE_VERDICTLAYER_INTEGRATION_MODE=mock` for now because write submits are not implemented. The diagnostics panel can still use the contract address for read-only testing.

## Browser Read Smoke Test Status

The browser read smoke test succeeded. The GenLayer Read Diagnostics panel read all four deployed contract read methods:

- `get_contract_version`
- `get_latest_claim_verdict`
- `get_latest_task_verdict`
- `get_latest_dispute_verdict`

No transactions were sent, runtime remained in mock mode, and write transactions are still not implemented. A local `.env` file was used for the public contract address and must not be committed.

## Not Implemented Yet

Write transactions are not implemented yet. Wallet-signed GenLayer submits should be added in a later isolated step after read behavior is verified.
