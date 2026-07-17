# Consenza Architecture

## Current Architecture

Consenza uses a Vite, React, and TypeScript frontend architecture. The app is a single-page experience with module metadata stored in `src/config/modules.ts` and module selection state managed in `src/App.tsx`.

## Future Architecture

Future versions should add mocked verdict flows first, then introduce GenLayer-specific integration in isolated steps. Contract work should live separately from the frontend until the product flows are clear and stable.

## Planned Folder Structure

```text
verdictlayer/
  contracts/
    DEPLOYMENT_REPORT.md
    README.md
    CONSENZA_CONTRACT_SPEC.md
    verdict_layer.py
    verdict_layer_skeleton.py
  INTEGRATION_CHECKLIST.md
  GENLAYER_READ_INTEGRATION.md
  GENLAYER_WRITE_PLAN.md
  README.md
  SUBMISSION_CHECKLIST.md
  DEMO_SCRIPT.md
  .env.example
  src/
    components/
      ClaimVerdictForm.tsx
      DisputeVerdictForm.tsx
      DisputeVerdictResultCard.tsx
      GenLayerReadDiagnostics.tsx
      GenLayerWriteDiagnostics.tsx
      NetworkStatusCard.tsx
      TaskVerdictForm.tsx
      TaskVerdictResultCard.tsx
      VerdictResultCard.tsx
      WalletStatusCard.tsx
    config/
      genlayerNetworks.ts
      integration.ts
      modules.ts
    lib/
      genlayerReadClient.ts
      genlayerReadSmokeTest.ts
      genlayerWriteClient.ts
      genlayerWriteTypes.ts
      README.md
      verdictLayerClient.ts
      verdictLayerClientTypes.ts
      verdictLayerMockClient.ts
      verdictLayerRealClient.ts
      wallet.ts
    types/
      contractSchemas.ts
      ethereum.ts
      verdict.ts
    utils/
      mockClaimJudge.ts
      mockDisputeResolver.ts
      mockTaskJudge.ts
    App.css
    App.tsx
    main.tsx
  ARCHITECTURE.md
  PROJECT_CONTEXT.md
```

## Build Phases

Phase 1: frontend shell

Phase 2: Claim Decisions mock flow

Claim Decisions mock flow implemented locally with deterministic mock logic. No GenLayer integration yet.

Phase 3: Task Reviews mock flow

Task Reviews mock flow implemented locally with deterministic scoring logic. No GenLayer integration yet.

Phase 4: Dispute Resolutions mock flow

Dispute Resolutions mock flow implemented locally with deterministic resolution logic. No GenLayer integration yet.

Phase 5: GenLayer Intelligent Contract

Contract-facing TypeScript schemas and GenLayer contract interface specification were added. No real GenLayer contract or frontend integration yet.

Phase 6: GenLayer frontend integration

Frontend flows now use a contract-boundary mock client. This isolates future GenLayerJS integration from React components.

Integration client abstraction added. React components now depend on verdictLayerClient instead of the mock client directly.

## Integration Readiness

Integration checklist added, and `.env.example` now documents planned GenLayer runtime variables. The real client remains a placeholder, and mock mode remains the only active runtime mode.

## Contract Deployment Milestone

The v0.1 deterministic contract was deployed in GenLayer Studio. It stores latest JSON-like result strings for claim, task, and dispute modules.

Frontend integration is still intentionally separated through the client boundary layer.

## Submission-Ready MVP

The frontend and contract are intentionally decoupled. The frontend demonstrates the UX for all three verdict modules, while the contract demonstrates GenLayer deployment and the method interface.

The future step is replacing the mock client with real GenLayer integration through the existing client boundary layer.

## Async Client Boundary

All module submits now use async client calls. This prepares the UI for wallet-signed GenLayer transactions while keeping mock mode as the active runtime.

No real GenLayerJS integration has been added yet.

## Wallet Preparation Layer

Injected wallet detection and a wallet account request flow have been added for future GenLayer transactions. There is no network switching yet, and no real GenLayer transaction calls have been implemented.

Runtime remains in mock mode, so Claim, Task, and Dispute verdict flows continue to work without a connected wallet.

## Network Detection Layer

Static GenLayer network metadata has been added for Studionet and Bradbury. The app can read the connected wallet chain id with `eth_chainId` and display whether the wallet is on a supported GenLayer network.

No real GenLayer transactions are sent from the detection layer. Runtime remains in mock mode.

## Network Switching Layer

Wallet network switching support has been added with `wallet_switchEthereumChain`, plus a `wallet_addEthereumChain` fallback when the target GenLayer chain is missing from the wallet. The target network defaults to Studionet, while Bradbury metadata is prepared for later use.

The network switching layer does not send contract writes. Runtime remains in mock mode.

## Read-Only GenLayer Client Layer

Environment-based runtime selection is prepared through `src/config/integration.ts`, while mock remains the default unless `VITE_VERDICTLAYER_INTEGRATION_MODE=genlayer` is set. Read-only contract methods can be called through `src/lib/genlayerReadClient.ts`.

Frontend forms still use the client boundary and remain safe for mock runtime by default. Production form write transactions remain unimplemented.

## Read Diagnostics Layer

The UI can manually trigger read-only GenLayer contract calls through the GenLayer Read Diagnostics panel. No transactions are sent, and mock verdict flows remain active.

## Verified Browser Read Path

The Vite frontend can call deployed GenLayer read methods through the diagnostics panel. The verified browser path reads the contract version and latest module results for Claim, Task, and Dispute.

The read diagnostics path does not send wallet-signed writes.

## Write Transaction Planning

The wallet-signed write lifecycle has been planned, and the installed GenLayerJS write API has been inspected. Production write runtime is not wired into the module forms yet.

The next step after diagnostics validation is wiring production form submits to real GenLayer transactions behind the integration boundary.

## Dev-Only Write Diagnostics Layer

One Claim write transaction path exists for diagnostics. It is isolated from production forms, uses wallet-signed GenLayer `writeContract`, waits for a receipt, and reads the latest Claim result after the receipt.

A Task write helper also exists for diagnostics. It is isolated from production forms and reads the latest Task result after the receipt.

A Dispute write helper also exists for diagnostics. It is isolated from production forms and reads the latest Dispute result after the receipt.

Diagnostics remain isolated from the production form router.

## Verified Claim Write Path

The browser can submit `submit_claim_verdict` through GenLayerJS. A wallet-signed transaction succeeded, and the read-after-write flow returned the updated latest Claim result.

This path is still isolated from production forms.

## Task Write Diagnostics Path

The Task write helper exists for `submit_task_verdict`. It remains isolated from production forms and reads the latest Task result after the receipt.

## Verified Task Write Path

The browser can submit `submit_task_verdict` through GenLayerJS. A wallet-signed transaction succeeded, and the read-after-write flow returned the updated latest Task result.

This path is still isolated from production forms.

## Dispute Write Diagnostics Path

The Dispute write helper exists for `submit_dispute_verdict`. It remains isolated from production forms and reads the latest Dispute result after the receipt.

## Verified Dispute Write Path

The browser can submit `submit_dispute_verdict` through GenLayerJS. A wallet-signed transaction succeeded, and the read-after-write flow returned the updated latest Dispute result.

Claim, Task, and Dispute diagnostics are now all verified. Production forms remain isolated from real writes.

## Staged Production Integration

Claim, Task, and Dispute are real GenLayer-enabled production modules. The staged client router sends their submissions to the real client only when integration mode is `genlayer`, while mock mode remains the safe fallback.

Wallet and supported-network context is passed explicitly from the app through all three production forms to the client boundary. The read and write diagnostics remain available independently.

## Verified Production Claim Path

Claim routes to the real GenLayer client only when integration mode is `genlayer`. Wallet and supported-network context are required, and the transaction lifecycle is surfaced to the Claim UI.

Typed Claim result validation succeeded after read-after-write. Task and Dispute are also production-enabled.

## Verified Production Task Path

Task routes to the real GenLayer client only when integration mode is `genlayer`. Explicit wallet and supported-network context is required, and the transaction lifecycle is surfaced in the Task UI.

The raw Task result is strictly parsed. Compatibility normalization converts the deployed v0.1 `missingItems` string output into `string[]`.

The wallet-signed Task transaction and typed result validation succeeded. Claim and Task are verified real paths.

## Verified Production Dispute Path

Dispute routes to the real GenLayer client only when integration mode is `genlayer`. Explicit wallet and supported-network context is required, and the transaction lifecycle is surfaced in the Dispute UI.

The raw result is strictly parsed into `DisputeVerdictContractResult`. The wallet-signed transaction succeeded, `side_a` is rendered as the readable label "side a", and `contract_execution` is handled safely.

## Completed Production Router

In `mock` mode:

- Claim -> mock client
- Task -> mock client
- Dispute -> mock client

In `genlayer` mode:

- Claim -> real client
- Task -> real client
- Dispute -> real client

Diagnostics remain isolated from production forms. No automatic transaction submission exists; every real transaction requires manual form submission and wallet approval.

## Shared GenLayer Error Normalization

Transaction helpers normalize unknown SDK and provider errors centrally. Wallet rejection is recognized through common provider codes, error names, and message patterns.

Internal SDK details, version strings, and stack traces are not surfaced to production forms. Forms retain their inputs and display the existing retry state, while diagnostics receive normalized errors through the same transaction helpers.

### Manual Verification

Claim, Task, and Dispute display the same normalized wallet-rejection message. A rejected request creates no transaction hash or result, controlled inputs remain preserved, write status transitions to `error`, and retry UI remains available. Provider and SDK details are not surfaced.

## Public Frontend Deployment Model

Consenza produces a static Vite bundle and interacts with GenLayerJS entirely in the browser through an injected wallet provider. Contract address, network name, integration mode, and diagnostics visibility are public frontend configuration; no private value belongs in a `VITE_` variable.

There is no backend or database deployment dependency. Read and write diagnostics are hidden by default through `VITE_SHOW_GENLAYER_DIAGNOSTICS`, while production forms remain available. Every write still requires an explicit form submission and manual wallet approval.
